export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--color-bg-alt)',
        borderTop: '1px solid var(--color-border)',
        padding: 'var(--space-8) 0',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-5)',
          }}
        >
          {/* Main credit */}
          <div
            style={{
              fontSize: 'var(--text-base)',
              color: 'var(--color-text-secondary)',
            }}
          >
            Designed and developed by{' '}
            <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>
              Fabio Valsecchi
            </span>
          </div>

          {/* Attributions */}
          <div
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-tertiary)',
            }}
          >
            <div style={{ marginBottom: 'var(--space-2)', fontWeight: 500 }}>
              Icon attributions
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--space-3)',
              }}
            >
              <a
                href="https://www.flaticon.com/free-icons/imagination"
                title="imagination icons"
                style={{
                  color: 'var(--color-text-tertiary)',
                  textDecoration: 'underline',
                  textUnderlineOffset: '2px',
                }}
              >
                Imagination
              </a>
              <span>·</span>
              <a
                href="https://www.flaticon.com/free-icons/software-development"
                title="software development icons"
                style={{
                  color: 'var(--color-text-tertiary)',
                  textDecoration: 'underline',
                  textUnderlineOffset: '2px',
                }}
              >
                Software development
              </a>
              <span>·</span>
              <a
                href="https://www.flaticon.com/free-icons/graphic-design"
                title="graphic design icons"
                style={{
                  color: 'var(--color-text-tertiary)',
                  textDecoration: 'underline',
                  textUnderlineOffset: '2px',
                }}
              >
                Graphic design
              </a>
              <span style={{ marginLeft: 'var(--space-1)' }}>— Freepik via Flaticon</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
