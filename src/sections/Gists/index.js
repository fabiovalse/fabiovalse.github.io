import { Link } from 'react-router-dom';
import groups from './gists.json';
import './index.css';

export default function Gists({ id }) {
  return (
    <section
      id={id}
      style={{
        backgroundColor: 'white',
        padding: 'var(--space-12) 0',
      }}
    >
      {/* Section Header */}
      <div className="container" style={{ marginBottom: 'var(--space-10)' }}>
        <h2
          style={{
            fontSize: 'var(--text-4xl)',
            fontWeight: 800,
            marginBottom: 'var(--space-2)',
            letterSpacing: '-0.02em',
          }}
        >
          Gists
        </h2>
        <p
          style={{
            fontSize: 'var(--text-lg)',
            color: 'var(--color-text-secondary)',
          }}
        >
          Remember github gists hosted on bl.ocks?
        </p>
      </div>

      {/* Gist Groups */}
      {groups.map(({ group, gists }) => (
        <div key={group || 'ungrouped'} style={{ marginBottom: 'var(--space-10)' }}>
          {group && (
            <div className="container" style={{ marginBottom: 'var(--space-5)' }}>
              <h3
                style={{
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 700,
                  color: 'var(--color-text)',
                }}
              >
                {group}
              </h3>
            </div>
          )}

          <div className="container-wide">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 'var(--space-5)',
              }}
            >
              {gists
                .sort((a, b) => (a.created_at > b.created_at ? 1 : -1))
                .map((gist) => {
                  const thumbnail = getThumbnail(gist.files);

                  return (
                    <Link
                      key={gist.id}
                      to={`/gist/${gist.id}`}
                      className="gist-card"
                      style={{
                        display: 'block',
                        textDecoration: 'none',
                        color: 'inherit',
                      }}
                    >
                      <div
                        className="gist-thumbnail"
                        style={{
                          aspectRatio: '1',
                          overflow: 'hidden',
                          backgroundColor: 'var(--color-bg-alt)',
                          borderRadius: 'var(--radius-lg)',
                          border: '1px solid var(--color-border)',
                        }}
                      >
                        {thumbnail && (
                          <img
                            src={thumbnail.raw_url}
                            alt={gist.description || 'gist preview'}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              transition: 'transform var(--transition-slow)',
                            }}
                          />
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: 'var(--text-base)',
                          fontWeight: 600,
                          marginTop: 'var(--space-3)',
                          lineHeight: 1.4,
                          color: 'var(--color-text)',
                        }}
                      >
                        {gist.description || 'Untitled gist'}
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

function getThumbnail(files) {
  const fileList = Object.values(files);
  return fileList.find((file) =>
    /thumb|preview|screenshot|thumbnail/i.test(file.filename)
  );
}
