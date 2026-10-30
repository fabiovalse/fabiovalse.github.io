import { Link } from 'react-router-dom';
import groups from './gists.json';
import './index.css';

export default function Gists({ id }) {
  return (
    <>
      <div id={id} style={{ maxWidth: 600, padding: "100px 0px 24px 0px", margin: "auto" }}>
        <div
          style={{
            fontSize: 42,
            fontWeight: 600
          }}
        >
          Gists
        </div>

        <div style={{ color: "var(--text-secondary)" }}>
          Remember github gists hosted on bl.ocks?
        </div>
      </div>

      {groups.map(({ group, gists }) => (
        <div key={group} style={{ padding: "48px", margin: "auto" }}>
          
          {
            group &&
              <>
                <div style={{ fontSize: 30, fontWeight: 600, maxWidth: 600, margin: "auto", marginBottom: '16px', marginTop: '32px' }}>
                  {group}

                  <div
                    style={{
                      width: "100px",
                      margin: "16px 0px 48px 0px",
                      borderBottom: "3px solid var(--red)",
                    }}
                  />
                </div>
              </>
          }
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center' }}>
            {gists
              .sort((a,b) => a.created_at > b.created_at ? 1 :-1)
              .map(gist => {
                const thumbnail = getThumbnail(gist.files);

                return (
                  <Link key={gist.id} to={`/gist/${gist.id}`} className="gist-card" style={{ width: 200, textDecoration: 'none', color: 'inherit' }}>
                    <div className="gist-thumbnail" style={{ width: 200, height: 200, overflow: 'hidden', background: '#f0f0f0', borderRadius: '8px' }}>
                      {thumbnail && (
                        <img
                          src={thumbnail.raw_url}
                          alt={gist.description || "gist preview"}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      )}
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 600, marginTop: 8 }}>{gist.description || "Untitled gist"}</div>
                  </Link>
                );
              })
            }
          </div>
        </div>
      ))}
    </>
  );
}

function getThumbnail(files) {
  const fileList = Object.values(files);
  return fileList.find(file =>
    /thumb|preview|screenshot|thumbnail/i.test(file.filename)
  );
}
