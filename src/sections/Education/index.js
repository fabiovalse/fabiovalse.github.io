import data from "./data.json";

export default function Education({ id }) {
  return (
    <section
      id={id}
      style={{
        backgroundColor: 'white',
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
            }}
          >
            Education
          </h2>
          <p
            style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
            }}
          >
            What&apos;s my background?
          </p>
        </div>

        {/* Education Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {data.map((item) => (
            <div
              key={item.short_label}
              style={{
                padding: 'var(--space-6)',
                backgroundColor: 'var(--color-bg-accent-soft)',
                borderRadius: 'var(--radius-lg)',
                borderLeft: '3px solid var(--color-accent)',
              }}
            >
              <div
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  color: 'var(--color-accent)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: 'var(--space-2)',
                }}
              >
                {item.timerange.start} — {item.timerange.end}
              </div>
              <h3
                style={{
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 700,
                  marginBottom: 'var(--space-1)',
                  letterSpacing: '-0.01em',
                }}
              >
                {item.label}
              </h3>
              <div
                style={{
                  fontSize: 'var(--text-base)',
                  color: 'var(--color-text-secondary)',
                  fontWeight: 500,
                }}
              >
                {item.location}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
