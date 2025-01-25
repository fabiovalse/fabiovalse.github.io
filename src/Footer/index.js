export default function Footer() {
  return (
    <div style={{ backgroundColor: "var(--yellow)" }}>
      <div
        style={{
          maxWidth: 600,
          margin: "auto",
          height: "100%",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <div style={{ padding: "24px 0px" }}>
          <div>
            Designed and developed by <strong>Fabio Valsecchi</strong>
          </div>

          <div style={{ padding: "24px 0px", fontSize: 14 }}>
            <div style={{ marginBottom: 8 }}>Icon attributions:</div>
            <div>
              <a
                href="https://www.flaticon.com/free-icons/imagination"
                title="imagination icons"
                style={{ color: "var(--text-primary)" }}
              >
                Imagination icons created by Freepik - Flaticon
              </a>
            </div>
            <div>
              <a
                href="https://www.flaticon.com/free-icons/software-development"
                title="software development icons"
                style={{ color: "var(--text-primary)" }}
              >
                Software development icons created by Freepik - Flaticon
              </a>
            </div>
            <div>
              <a
                href="https://www.flaticon.com/free-icons/graphic-design"
                title="graphic design icons"
                style={{ color: "var(--text-primary)" }}
              >
                Graphic design icons created by Freepik - Flaticon
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
