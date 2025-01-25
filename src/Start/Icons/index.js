import "./index.css";

export default function Icons() {
  return (
    <div className="icons" style={{ flexGrow: 1, textAlign: "center" }}>
      <div>
        <img
          style={{ padding: 10 }}
          width="150px"
          src="media/imagination.png"
        />
      </div>

      <div>
        <img
          style={{ padding: 25 }}
          width="80px"
          src="media/software-development.png"
        />

        <img
          style={{ padding: 25 }}
          width="80px"
          src="media/illustration.png"
        />
      </div>
    </div>
  );
}
