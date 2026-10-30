const toolkitData = [
  { category: 'Core', items: ['React', 'TypeScript', 'React Router'] },
  { category: 'State', items: ['Zustand', 'React Context', 'Redux'] },
  { category: 'Forms', items: ['React Hook Form'] },
  { category: 'i18n', items: ['React Intl'] },
  { category: 'UI', items: ['Material UI'] },
  { category: 'Data Viz', items: ['D3.js'] },
  { category: 'Monitoring', items: ['Sentry', 'Web Vitals'] },
  { category: 'Payments', items: ['Stripe'] },
  { category: 'Build', items: ['npm', 'Webpack', 'Vite'] },
];

export default function Technologies({ id }) {
  return (
    <section
      id={id}
      style={{
        backgroundColor: 'var(--color-bg-dark)',
        padding: 'var(--space-12) 0',
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ marginBottom: 'var(--space-10)' }}>
          <h2
            style={{
              fontSize: 'var(--text-4xl)',
              fontWeight: 800,
              marginBottom: 'var(--space-2)',
              letterSpacing: '-0.02em',
              color: 'white',
            }}
          >
            Toolkit
          </h2>
          <p
            style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-tertiary)',
            }}
          >
            How do I typically built Web apps?
          </p>
        </div>

        {/* Tech Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 'var(--space-5)',
          }}
        >
          {toolkitData.map((group) => (
            <div
              key={group.category}
              style={{
                padding: 'var(--space-5)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div
                style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--color-accent-light)',
                  marginBottom: 'var(--space-3)',
                }}
              >
                {group.category}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {group.items.map((item) => (
                  <span
                    key={item}
                    style={{
                      fontSize: 'var(--text-lg)',
                      fontWeight: 600,
                      color: 'white',
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
