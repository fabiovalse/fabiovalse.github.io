import Icons from "./Icons";

export default function Start() {
  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        paddingTop: 'var(--nav-height)',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-10)',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <div style={{ maxWidth: '560px', flex: '1 1 400px' }}>
            {/* Greeting */}
            <p
              style={{
                fontSize: 'var(--text-lg)',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-3)',
                fontWeight: 500,
              }}
            >
              Hey there, I&apos;m
            </p>

            {/* Name */}
            <h1
              style={{
                fontSize: 'var(--text-6xl)',
                fontWeight: 900,
                marginBottom: 'var(--space-5)',
                letterSpacing: '-0.03em',
                lineHeight: 1,
              }}
            >
              Fabio
              <span style={{ color: 'var(--color-accent)' }}>.</span>
            </h1>

            {/* Tagline */}
            <p
              style={{
                fontSize: 'var(--text-xl)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6,
                maxWidth: '480px',
              }}
            >
              A developer and designer crafting modern web applications with a focus on{' '}
              <span style={{ color: 'var(--color-text)', fontWeight: 600 }}>
                data visualization
              </span>{' '}
              and{' '}
              <span style={{ color: 'var(--color-text)', fontWeight: 600 }}>
                user experience
              </span>.
            </p>

            {/* Quick links */}
            <div
              style={{
                display: 'flex',
                gap: 'var(--space-4)',
                marginTop: 'var(--space-6)',
                flexWrap: 'wrap',
              }}
            >
              <a
                href="#exp"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-3) var(--space-5)',
                  backgroundColor: 'var(--color-accent)',
                  color: 'white',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 600,
                  fontSize: 'var(--text-sm)',
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--color-accent-hover)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'var(--color-accent)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                View Experience
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </a>
              <a
                href="#gists"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-3) var(--space-5)',
                  backgroundColor: 'transparent',
                  color: 'var(--color-text)',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 600,
                  fontSize: 'var(--text-sm)',
                  border: '2px solid var(--color-border-strong)',
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = 'var(--color-text)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = 'var(--color-border-strong)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Browse Gists
              </a>
            </div>
          </div>

          <Icons />
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: 'var(--space-8)',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-2)',
        }}
      >
        <span
          style={{
            fontSize: 'var(--text-xs)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--color-text-tertiary)',
            fontWeight: 500,
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: '24px',
            height: '40px',
            borderRadius: '12px',
            border: '2px solid var(--color-border-strong)',
            display: 'flex',
            justifyContent: 'center',
            paddingTop: 'var(--space-2)',
          }}
        >
          <div
            style={{
              width: '4px',
              height: '8px',
              borderRadius: '2px',
              backgroundColor: 'var(--color-accent)',
              animation: 'bounce 1.5s ease-in-out infinite',
            }}
          />
        </div>
      </div>
    </section>
  );
}
