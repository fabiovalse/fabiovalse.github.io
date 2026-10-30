const projects = [
  {
    id: 'milan-weather',
    title: 'Milan Weather Wheel',
    description: 'Radial visualization of temperature data collected from OpenWeatherMap API since 2021.',
    url: 'https://fabiovalse.github.io/data-collector/milan/app-history/',
    github: 'https://github.com/fabiovalse/data-collector',
    tags: ['D3.js', 'Live Data', 'Weather'],
  },
  {
    id: 'dht22-sensor',
    title: 'DHT22 Sensor Wheel',
    description: 'Temperature and humidity data from a DIY Raspberry Pi sensor, visualized as a radial chart.',
    url: 'https://fabiovalse.github.io/data-collector/dht22/app-history/',
    github: 'https://github.com/fabiovalse/data-collector',
    tags: ['D3.js', 'Raspberry Pi', 'DHT22'],
  },
];

export default function LiveProjects({ id }) {
  return (
    <section
      id={id}
      style={{
        backgroundColor: 'var(--color-bg-alt)',
        padding: 'var(--space-12) 0',
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <h2
            style={{
              fontSize: 'var(--text-4xl)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              marginBottom: 'var(--space-2)',
            }}
          >
            Live Projects
          </h2>
          <p
            style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
            }}
          >
            Data visualizations running on real-time data
          </p>
        </div>

        {/* Projects Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'var(--space-5)',
          }}
        >
          {projects.map((project) => (
            <a
              key={project.id}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                backgroundColor: 'white',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                border: '1px solid var(--color-border)',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'all var(--transition-base)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                e.currentTarget.style.borderColor = 'var(--color-accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'var(--color-border)';
              }}
            >
              {/* Preview iframe */}
              <div
                style={{
                  position: 'relative',
                  height: '280px',
                  overflow: 'hidden',
                  backgroundColor: 'white',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <iframe
                  src={project.url}
                  title={project.title}
                  style={{
                    width: '200%',
                    height: '200%',
                    border: 'none',
                    transform: 'scale(0.5)',
                    transformOrigin: 'top left',
                    pointerEvents: 'none',
                  }}
                  loading="lazy"
                />
                {/* Overlay to prevent interaction */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    cursor: 'pointer',
                  }}
                />
              </div>

              {/* Content */}
              <div style={{ padding: 'var(--space-5)' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--space-2)',
                  }}
                >
                  <h3
                    style={{
                      fontSize: 'var(--text-xl)',
                      fontWeight: 700,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {project.title}
                  </h3>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ color: 'var(--color-text-tertiary)', flexShrink: 0 }}
                  >
                    <path d="M4 12L12 4M12 4H6M12 4v6" />
                  </svg>
                </div>

                <p
                  style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.6,
                    marginBottom: 'var(--space-4)',
                  }}
                >
                  {project.description}
                </p>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', alignItems: 'center' }}>
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        padding: 'var(--space-1) var(--space-2)',
                        backgroundColor: 'var(--color-bg-alt)',
                        color: 'var(--color-text-secondary)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 500,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      marginLeft: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-1)',
                      padding: 'var(--space-1) var(--space-2)',
                      color: 'var(--color-text-tertiary)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 500,
                      textDecoration: 'none',
                      borderRadius: 'var(--radius-sm)',
                      transition: 'color var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--color-text)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--color-text-tertiary)';
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                    </svg>
                    Code
                  </a>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </section>
  );
}
