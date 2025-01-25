export default function NavBar({ items }) {
  return (
    <div
      style={{
        margin: 10,
        width: "inherit",
        display: "flex",
        gap: 40,
        position: "fixed",
        right: 10
      }}
    >
      {items.map(({ id, label }) => (
        <div key={id}>
          <a
            href={`#${id}`}
            style={{
              fontWeight: 800,
              fontSize: 18,
              letterSpacing: "3px",
              color: "var(--red)",
              textDecoration: "none"
            }}
          >
            {label.toUpperCase()}
          </a>
        </div>
      ))}
    </div>
  );
}
