import "./index.css";

export default function Icons() {
  return (
    <div
      className="icons"
      style={{
        flex: '0 0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-4)',
      }}
    >
      {/* Main icon */}
      <div
        style={{
          width: '180px',
          height: '180px',
          borderRadius: 'var(--radius-xl)',
          backgroundColor: 'var(--color-bg-accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          width="120"
          src="media/imagination.png"
          alt="Creative thinking"
          style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}
        />
      </div>

      {/* Secondary icons */}
      <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
        <div
          style={{
            width: '90px',
            height: '90px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--color-bg-alt)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            width="54"
            src="media/software-development.png"
            alt="Software development"
          />
        </div>
        <div
          style={{
            width: '90px',
            height: '90px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--color-bg-alt)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            width="54"
            src="media/illustration.png"
            alt="Illustration and design"
          />
        </div>
      </div>
    </div>
  );
}
