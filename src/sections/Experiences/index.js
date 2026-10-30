import data from "./data.json";

export default function Experiences({ id }) {
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
        <div style={{ marginBottom: 'var(--space-10)' }}>
          <h2
            style={{
              fontSize: 'var(--text-4xl)',
              fontWeight: 800,
              marginBottom: 'var(--space-2)',
              letterSpacing: '-0.02em',
            }}
          >
            Experience
          </h2>
          <p
            style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
            }}
          >
            What did I do in the last years?
          </p>
        </div>

        {/* Timeline */}
        <div className="timeline">
          {data.map((item) => (
            <div key={item.short_label} className="timeline-item">
              <div className="timeline-date">
                {item.timerange.start} — {item.timerange.end}
              </div>
              <h3 className="timeline-title">{item.label}</h3>
              <div className="timeline-location">
                {item.place && `${item.place} · `}
                {item.location}
              </div>
              <p className="timeline-description">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
