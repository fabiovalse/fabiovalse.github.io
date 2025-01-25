export default function Technologies({ id }) {
  return (
    <div id={id} style={{ background: "var(--text-primary)" }}>
      <div style={{ maxWidth: 600, padding: "100px 24px", margin: "auto" }}>
        <div
          style={{
            fontSize: "42px",
            fontWeight: 600,
            color: "white"
          }}
        >
          Toolkit
        </div>

        <div style={{ color: "var(--red)" }}>
          How do I typically build a Web app?
        </div>

        <div style={{ fontSize: 24, color: "white" }}>
          <div
            style={{
              margin: "48px 0px",
              borderLeft: "2px solid #DFE3E8",
              paddingLeft: 24
            }}
          >
            <div>Favourite framework? </div>
            <div style={{ fontWeight: 600, color: "var(--red)" }}>React JS</div>
          </div>

          <div
            style={{
              margin: "48px 0px",
              borderLeft: "2px solid #DFE3E8",
              paddingLeft: 24
            }}
          >
            <div>What about other essentials? </div>
            <div style={{ fontWeight: 600, color: "var(--red)" }}>
              Typescript and React-Router
            </div>
          </div>

          <div
            style={{
              margin: "48px 0px",
              borderLeft: "2px solid #DFE3E8",
              paddingLeft: 24
            }}
          >
            <div>Centralized store?</div>
            <div style={{ fontWeight: 600, color: "var(--red)" }}>
              Zustand or React Context
            </div>
            <br />
            <div>Zu what? What about Redux?</div>
            <div style={{ fontWeight: 600, color: "var(--red)" }}>No more</div>
          </div>

          <div
            style={{
              margin: "48px 0px",
              borderLeft: "2px solid #DFE3E8",
              paddingLeft: 24
            }}
          >
            <div>Lot of forms to handle?</div>
            <div style={{ fontWeight: 600, color: "var(--red)" }}>
              React-Hook-Form
            </div>
          </div>

          <div
            style={{
              margin: "48px 0px",
              borderLeft: "2px solid #DFE3E8",
              paddingLeft: 24
            }}
          >
            <div>Multilinguism?</div>
            <div style={{ fontWeight: 600, color: "var(--red)" }}>
              React-Intl
            </div>
          </div>

          <div
            style={{
              margin: "48px 0px",
              borderLeft: "2px solid #DFE3E8",
              paddingLeft: 24
            }}
          >
            <div>What about the UI?</div>
            <div style={{ fontWeight: 600, color: "var(--red)" }}>
              Material-UI
            </div>
          </div>

          <div
            style={{
              margin: "48px 0px",
              borderLeft: "2px solid #DFE3E8",
              paddingLeft: 24
            }}
          >
            <div>Exceptions and performances?</div>
            <div style={{ fontWeight: 600, color: "var(--red)" }}>
              Sentry and Web Vitals
            </div>
          </div>

          <div
            style={{
              margin: "48px 0px",
              borderLeft: "2px solid #DFE3E8",
              paddingLeft: 24
            }}
          >
            <div>Data Visualization?</div>
            <div style={{ fontWeight: 600, color: "var(--red)" }}>D3</div>
          </div>

          <div
            style={{
              margin: "48px 0px",
              borderLeft: "2px solid #DFE3E8",
              paddingLeft: 24
            }}
          >
            <div>Have you ever worked with payments?</div>
            <div style={{ fontWeight: 600, color: "var(--red)" }}>
              Yep, Stripe
            </div>
          </div>

          <div
            style={{
              margin: "48px 0px",
              borderLeft: "2px solid #DFE3E8",
              paddingLeft: 24
            }}
          >
            <div>What else?</div>
            <div style={{ fontWeight: 600, color: "var(--red)" }}>
              Yeah, of course NPM and Webpack
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
