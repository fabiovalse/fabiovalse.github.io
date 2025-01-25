import data from "./data.json";

export default function Experiences({ id }) {
  return (
    <div id={id} style={{ background: "var(--lightgray)" }}>
      <div style={{ maxWidth: 600, padding: "100px 24px", margin: "auto" }}>
        <div
          style={{
            fontSize: 42,
            fontWeight: 600
          }}
        >
          Experiences
        </div>

        <div style={{ color: "var(--text-secondary)" }}>
          What did I do in the last years?
        </div>

        {data.map((item) => (
          <div key={item.short_label} style={{ padding: "50px 0px" }}>
            <div
              style={{
                fontWeight: 600,
                fontSize: 16,
                letterSpacing: "3px",
                color: "var(--red)"
              }}
            >
              {item.timerange.start.toUpperCase()} -{" "}
              {item.timerange.end.toUpperCase()}
            </div>

            <div
              style={{
                fontSize: 30,
                fontWeight: 600,
                margin: "8px 0px"
              }}
            >
              {item.label}
            </div>

            <div style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
              {item.place} @{item.location}
            </div>

            <div
              style={{
                width: "100px",
                margin: "16px 0px",
                borderBottom: "3px solid var(--red)"
              }}
            />

            <div>{item.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
