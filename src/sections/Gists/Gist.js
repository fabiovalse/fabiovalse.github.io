import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { marked } from 'marked';
import groups from './gists.json';

const allGists = groups.flatMap(g => g.gists);

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

  if (!gist) return <div style={{ padding: 32 }}>Gist not found.</div>;

  const readmeHtml = readme
    ? marked(readme.replace(/https?:\/\/bl\.ocks\.org\/fabiovalse\/([a-f0-9]+)/gi, '/gist/$1'))
    : '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ padding: '8px 16px', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={() => {
            document.documentElement.style.scrollBehavior = 'auto';
            navigate(-1);
            setTimeout(() => {
              document.documentElement.style.scrollBehavior = '';
            }, 100);
          }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}
          aria-label="Back to home"
        >
          ← Back
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          Loading…
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {blobUrl && (
            <iframe
              title={gist.description || 'Gist preview'}
              src={blobUrl}
              sandbox="allow-scripts allow-same-origin"
              style={{ width: '100%', height: 'calc(100vh - 250px)', border: 'none' }}
            />
          )}
          <div style={{ padding: '24px 32px', borderTop: '1px solid #e0e0e0' }}>
            <h2>{gist.description || 'Untitled gist'}</h2>
            {readme && (
              <div
                style={{ fontSize: 14, lineHeight: 1.6 }}
                dangerouslySetInnerHTML={{ __html: readmeHtml }}
              />
            )}
          </div>
          {sourceFiles.length > 0 && (
            <div style={{ padding: '0 32px 32px' }}>
              {sourceFiles.map(f => (
                <div key={f.filename} style={{ marginBottom: 24 }}>
                  <h4 style={{ margin: '16px 0 8px', fontFamily: 'monospace' }}>{f.filename}</h4>
                  <pre style={{
                    background: '#f5f5f5', padding: 16, borderRadius: 8,
                    overflow: 'auto', fontSize: 13, lineHeight: 1.5,
                    border: '1px solid #e0e0e0',
                  }}>
                    <code>{f.content}</code>
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {gist.generate_new && (
        <button
          onClick={handleRefresh}
          aria-label="Refresh gist"
          style={{
            position: 'fixed', top: 48, right: 8, padding: '0px 16px',
            background: 'var(--red)', color: '#fff', border: 'none',
            borderRadius: 8, height: 30, cursor: 'pointer',
            fontSize: 14, fontWeight: 600, lineHeight: '20px', textAlign: 'center',
            fontFamily: 'inherit',
          }}
        >
          GENERATE NEW
        </button>
      )}

      {gist.zoom_and_pan && (
        <span
          style={{
            position: 'fixed', top: gist.generate_new ? 86 : 48, right: 8, padding: '0px 12px',
            background: '#86919e', color: '#fff', border: 'none',
            borderRadius: 15, height: 26, lineHeight: '26px',
            fontSize: 12, fontWeight: 600, textAlign: 'center',
          }}
        >
          ZOOM &amp; PAN
        </span>
      )}
    </div>
  );
}
