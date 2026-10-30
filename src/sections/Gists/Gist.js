import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { marked } from 'marked';
import groups from './gists.json';

const allGists = groups.flatMap(g => g.gists);

function CopyButton({ content, filename }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      aria-label={`Copy ${filename} to clipboard`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-1)',
        padding: 'var(--space-1) var(--space-2)',
        backgroundColor: copied ? 'var(--color-accent)' : 'transparent',
        color: copied ? 'white' : 'var(--color-text-tertiary)',
        border: `1px solid ${copied ? 'var(--color-accent)' : 'var(--color-border)'}`,
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        fontSize: 'var(--text-xs)',
        fontWeight: 500,
        fontFamily: 'inherit',
        transition: 'all var(--transition-fast)',
      }}
      onMouseEnter={(e) => {
        if (!copied) {
          e.currentTarget.style.backgroundColor = 'var(--color-bg-alt)';
          e.currentTarget.style.color = 'var(--color-text-secondary)';
        }
      }}
      onMouseLeave={(e) => {
        if (!copied) {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = 'var(--color-text-tertiary)';
        }
      }}
    >
      {copied ? (
        <>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13.5 4.5L6 12L2.5 8.5" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="5" y="5" width="9" height="9" rx="1" />
            <path d="M5 11H3a1 1 0 01-1-1V3a1 1 0 011-1h7a1 1 0 011 1v2" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

export default function Gist() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blobUrl, setBlobUrl] = useState(null);
  const [readme, setReadme] = useState(null);
  const [sourceFiles, setSourceFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const gist = allGists.find(g => g.id === id);

  const handleRefresh = useCallback(() => {
    if (blobUrl) URL.revokeObjectURL(blobUrl);
    setBlobUrl(null);
    setReadme(null);
    setSourceFiles([]);
    setLoading(true);
    setRefreshKey(k => k + 1);
  }, [blobUrl]);

  useEffect(() => {
    if (!gist) return;
    let cancelled = false;

    (async () => {
      try {
        const files = Object.values(gist.files);
        const htmlFile = files.find(f => f.filename === 'index.html');
        if (!htmlFile) { setLoading(false); return; }

        const htmlRes = await fetch(htmlFile.raw_url);
        let html = await htmlRes.text();

        const anyRawUrl = files[0].raw_url;
        const baseUrl = anyRawUrl.replace(/\/raw\/[^/]+\/[^/]+$/, '/raw/');
        html = html.replace(/<head([^>]*)>/i,
          `<head$1><base href="${baseUrl}"><style>html,body{width:100%;height:100%;margin:0;padding:0;overflow:hidden}svg{width:100%;height:100%}</style>`);
        html = html.replace(/(src|href)=(["'])http:\/\//gi, '$1=$2https://');
        html = html.replace(
          /https?:\/\/cdn\.leafletjs\.com\/leaflet\/v([^/]+)\//gi,
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/$1/'
        );

        // Replace dead rawgit.com URLs with jsdelivr (serves raw GitHub files)
        html = html.replace(
          /https?:\/\/rawgit\.com\/([^/]+)\/([^/]+)\/([^/]+)\//gi,
          'https://cdn.jsdelivr.net/gh/$1/$2@$3/'
        );

        // Replace sourceforge jsclipper (no CORS) with jsdelivr
        html = html.replace(
          /https?:\/\/jsclipper\.sourceforge\.net\/[^"']+\/clipper\.js/gi,
          'https://cdn.jsdelivr.net/npm/js-clipper@1.0.1/clipper.js'
        );

        const fileMap = {};
        files.forEach(f => { fileMap[f.filename] = f.raw_url; });
        const resolveUrl = (ref) => fileMap[ref] || ref;

        const replacements = [];

        const scriptRegex = /<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>[\s\S]*?<\/script>/gi;
        for (const match of html.matchAll(scriptRegex)) {
          replacements.push({ index: match.index, length: match[0].length, url: resolveUrl(match[1]), type: 'script' });
        }

        const linkRegex = /<link\b[^>]*\bhref=["']([^"']+)["'][^>]*\/?>/gi;
        for (const match of html.matchAll(linkRegex)) {
          if (!/rel=["']stylesheet["']/i.test(match[0]) && !/type=["']text\/css["']/i.test(match[0])) continue;
          replacements.push({ index: match.index, length: match[0].length, url: resolveUrl(match[1]), type: 'style' });
        }

        await Promise.all(replacements.map(async (r) => {
          try {
            const res = await fetch(r.url);
            r.content = await res.text();
          } catch (e) {
            console.warn('Failed to fetch:', r.url, e);
            r.content = null;
          }
        }));

        replacements.sort((a, b) => b.index - a.index);
        for (const r of replacements) {
          if (r.content == null) continue;
          let tag;
          if (r.type === 'script') {
            const escaped = r.content.replace(/<\/script/gi, '<\\/script');
            tag = `<script>${escaped}</` + 'script>';
          } else {
            tag = `<style>${r.content}</style>`;
          }
          html = html.slice(0, r.index) + tag + html.slice(r.index + r.length);
        }

        if (cancelled) return;
        setBlobUrl(URL.createObjectURL(new Blob([html], { type: 'text/html' })));

        const readmeFile = files.find(f => /^readme\.md$/i.test(f.filename));
        if (readmeFile) {
          const readmeRes = await fetch(readmeFile.raw_url);
          if (!cancelled) setReadme(await readmeRes.text());
        }

        // Fetch all text-based source files for display
        const textFiles = files.filter(f =>
          !(/^readme\.md$/i.test(f.filename)) &&
          !(/thumb|preview|screenshot|thumbnail/i.test(f.filename)) &&
          (f.type && f.type.startsWith('text') || f.language)
        );
        const sources = await Promise.all(textFiles.map(async (f) => {
          try {
            const res = await fetch(f.raw_url);
            return { filename: f.filename, language: f.language, content: await res.text() };
          } catch (e) {
            return null;
          }
        }));
        if (!cancelled) setSourceFiles(sources.filter(Boolean));
      } catch (e) {
        console.error('Failed to load gist:', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [gist, refreshKey]);

  if (!gist) {
    return (
      <div
        style={{
          padding: 'var(--space-8)',
          textAlign: 'center',
          color: 'var(--color-text-secondary)',
        }}
      >
        Gist not found.
      </div>
    );
  }

  const readmeHtml = readme
    ? marked(readme.replace(/https?:\/\/bl\.ocks\.org\/fabiovalse\/([a-f0-9]+)/gi, '/gist/$1'))
    : '';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg)',
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: 'var(--space-3) var(--space-5)',
          borderBottom: '1px solid var(--color-border)',
          backgroundColor: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-4)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <button
          onClick={() => {
            document.documentElement.style.scrollBehavior = 'auto';
            navigate(-1);
            setTimeout(() => {
              document.documentElement.style.scrollBehavior = '';
            }, 100);
          }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            color: 'var(--color-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: 'var(--space-2) var(--space-3)',
            borderRadius: 'var(--radius-md)',
            transition: 'all var(--transition-fast)',
            fontFamily: 'inherit',
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'var(--color-bg-alt)';
            e.target.style.color = 'var(--color-text)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = 'var(--color-text-secondary)';
          }}
          aria-label="Back to home"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 12L6 8l4-4" />
          </svg>
          Back
        </button>

        <h1
          style={{
            fontSize: 'var(--text-base)',
            fontWeight: 600,
            color: 'var(--color-text)',
            margin: 0,
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {gist.description || 'Untitled gist'}
        </h1>

        {gist.generate_new && (
          <button
            onClick={handleRefresh}
            aria-label="Generate new"
            style={{
              padding: 'var(--space-2) var(--space-4)',
              backgroundColor: 'var(--color-accent)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              fontFamily: 'inherit',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--color-accent-hover)';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'var(--color-accent)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Generate New
          </button>
        )}

        {gist.zoom_and_pan && (
          <span
            style={{
              padding: 'var(--space-1) var(--space-3)',
              backgroundColor: 'var(--color-bg-alt)',
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-full)',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Zoom &amp; Pan
          </span>
        )}
      </header>

      {/* Main content */}
      {loading ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--text-lg)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
            }}
          >
            <div
              style={{
                width: '20px',
                height: '20px',
                border: '2px solid var(--color-border)',
                borderTopColor: 'var(--color-accent)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            Loading gist…
          </div>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          {/* Preview iframe */}
          {blobUrl && (
            <div
              style={{
                backgroundColor: 'white',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <iframe
                title={gist.description || 'Gist preview'}
                src={blobUrl}
                sandbox="allow-scripts allow-same-origin"
                style={{
                  width: '100%',
                  height: 'calc(100vh - 200px)',
                  border: 'none',
                  display: 'block',
                }}
              />
            </div>
          )}

          {/* Description and README */}
          <div
            style={{
              padding: 'var(--space-8)',
              backgroundColor: 'white',
              borderBottom: readme ? '1px solid var(--color-border)' : 'none',
            }}
          >
            <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h2
                style={{
                  fontSize: 'var(--text-3xl)',
                  fontWeight: 700,
                  marginBottom: 'var(--space-4)',
                  letterSpacing: '-0.02em',
                }}
              >
                {gist.description || 'Untitled gist'}
              </h2>

              {readme && (
                <div
                  style={{
                    fontSize: 'var(--text-base)',
                    lineHeight: 1.7,
                    color: 'var(--color-text-secondary)',
                  }}
                  className="readme-content"
                  dangerouslySetInnerHTML={{ __html: readmeHtml }}
                />
              )}
            </div>
          </div>

          {/* Source files */}
          {sourceFiles.length > 0 && (
            <div
              style={{
                padding: 'var(--space-8)',
                backgroundColor: 'var(--color-bg)',
              }}
            >
              <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h3
                  style={{
                    fontSize: 'var(--text-xl)',
                    fontWeight: 700,
                    marginBottom: 'var(--space-5)',
                    color: 'var(--color-text)',
                  }}
                >
                  Source Files
                </h3>

                {sourceFiles.map(f => (
                  <div key={f.filename} style={{ marginBottom: 'var(--space-6)' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 'var(--space-2)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <span
                          style={{
                            fontSize: 'var(--text-sm)',
                            fontWeight: 600,
                            fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                            color: 'var(--color-text)',
                          }}
                        >
                          {f.filename}
                        </span>
                        {f.language && (
                          <span
                            style={{
                              fontSize: 'var(--text-xs)',
                              padding: 'var(--space-1) var(--space-2)',
                              backgroundColor: 'var(--color-bg-alt)',
                              borderRadius: 'var(--radius-sm)',
                              color: 'var(--color-text-tertiary)',
                              textTransform: 'lowercase',
                            }}
                          >
                            {f.language}
                          </span>
                        )}
                      </div>
                      <CopyButton content={f.content} filename={f.filename} />
                    </div>
                    <pre
                      style={{
                        backgroundColor: 'var(--color-bg-dark)',
                        color: 'var(--color-text-inverse)',
                        padding: 'var(--space-5)',
                        borderRadius: 'var(--radius-lg)',
                        overflow: 'auto',
                        fontSize: 'var(--text-sm)',
                        lineHeight: 1.6,
                        margin: 0,
                        border: 'none',
                      }}
                    >
                      <code>{f.content}</code>
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* README styles */}
      <style>{`
        .readme-content a {
          color: var(--color-accent);
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .readme-content a:hover {
          color: var(--color-accent-hover);
        }
        .readme-content code {
          background: var(--color-bg-alt);
          padding: 2px 6px;
          border-radius: var(--radius-sm);
          font-size: 0.9em;
        }
        .readme-content pre {
          background: var(--color-bg-dark);
          color: var(--color-text-inverse);
          padding: var(--space-4);
          border-radius: var(--radius-md);
          overflow-x: auto;
        }
        .readme-content pre code {
          background: none;
          padding: 0;
        }
        .readme-content p {
          margin-bottom: var(--space-4);
        }
        .readme-content h1,
        .readme-content h2,
        .readme-content h3 {
          margin-top: var(--space-6);
          margin-bottom: var(--space-3);
          color: var(--color-text);
        }
        .readme-content ul,
        .readme-content ol {
          margin-bottom: var(--space-4);
          padding-left: var(--space-5);
        }
        .readme-content li {
          margin-bottom: var(--space-2);
        }
      `}</style>
    </div>
  );
}
