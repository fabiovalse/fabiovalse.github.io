import data from "./data.json";

export default function Education({ id }) {
  return (
    <div id={id} style={{ maxWidth: 600, padding: "0px 24px", margin: "auto" }}>
      <div style={{ margin: "100px 0px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <div
              style={{
                fontSize: 42,
                fontWeight: 600,
                color: "var(--red)"
              }}
            >
              Education
            </div>

            <div style={{ color: "var(--text-secondary)" }}>
              What&apos;s my background?
            </div>
          </div>
        </div>

        <div
          style={{
            padding: 24,
            marginTop: 8,
            backgroundColor: "var(--yellow)"
          }}
        >
          {data.map((item, index) => (
            <div key={item.short_label}>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: "3px",
                  color: "var(--red)"
                }}
              >
                {item.timerange.start.toUpperCase()} -{" "}
                {item.timerange.end.toUpperCase()}
              </div>

              <div
                style={{
                  fontSize: 32,
                  fontWeight: 600,
                  margin: "8px 0px"
                }}
              >
                {item.label}
              </div>

              <div
                style={{
                  fontWeight: 600,
                  color: "var(--text-secondary)"
                }}
              >
                {item.location}
              </div>

              {index < data.length - 1 && (
                <div
                  style={{
                    borderBottom: "2px solid var(--red)",
                    margin: "36px 0px"
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
