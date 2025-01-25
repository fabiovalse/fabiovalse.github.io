import Icons from "./Icons";

export default function Start() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center"
      }}
    >
      <div style={{ maxWidth: 820, padding: "96px 24px", margin: "auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 25,
            flexWrap: "wrap"
          }}
        >
          <div style={{ maxWidth: 535, margin: "auto" }}>
            <div
              style={{
                fontSize: 60,
                fontWeight: 900,
                marginBottom: "24px",
                paddingBottom: "24px",
                borderBottom: "4px solid var(--red)"
              }}
            >
              Hello! I&apos;m&nbsp;
              <span style={{ color: "var(--red)", fontWeight: 900 }}>
                Fabio
              </span>
              .
            </div>

            <div
              style={{
                fontSize: 22,
                fontWeight: 400,
                marginBottom: "24px",
                paddingBottom: "24px",
                color: "var(--text-secondary)"
              }}
            >
              I&apos;m a developer and designer specialized in creating Web
              applications based on modern Web technologies.
            </div>
          </div>

          <Icons />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          textAlign: "center",
          bottom: "10px",
          fontSize: "54px",
          color: "var(--red)",
          zIndex: 0,
          fontFamily: "monospace"
        }}
      >
        <div
          style={{
            animationDuration: "0.8s",
            animationIterationCount: "infinite",
            transformOrigin: "bottom",
            animationName: "bounce",
            animationTimingFunction: "ease"
          }}
        >
          ↓
        </div>
      </div>
    </div>
  );
}
