// src/component/AboutPage.tsx

/**
 * About page: one card explaining what this project is and who made it.
 * Same plain inline styles as ContactPage - no CSS file, no classes.
 *
 * To change the wording: edit the text below directly.
 * To change the tech list: edit STACK.
 */

const STACK = ["React", "TypeScript", "Vite", "Tailwind CSS", "Recharts"];

export function AboutPage() {
  return (
    <div
      style={{
        width: "min(600px, 90vw)",
        borderRadius: "20px",
        background: "rgba(20,10,32,0.6)",
        border: "1px solid rgba(255,255,255,0.15)",
        padding: "40px 32px",
        fontFamily: "'Julius Sans One', sans-serif",
        color: "#fff6e0",
      }}
    >
      <h1
        style={{
          fontSize: "26px",
          letterSpacing: "0.1em",
          margin: "0 0 28px",
          textAlign: "center",
        }}
      >
        ABOUT
      </h1>

      <p style={{ fontSize: "14px", lineHeight: 1.8, margin: "0 0 18px", opacity: 0.85 }}>
        Lofi Calculator is my first project. I wanted something to learn React
        with, and something I would actually keep open while studying.
      </p>

      <p style={{ fontSize: "14px", lineHeight: 1.8, margin: "0 0 18px", opacity: 0.85 }}>
        So it became a calculator you can leave running in the background:
        NPV and IRR charts for finance work, nine lofi tracks, and animated
        backgrounds that switch between day and night.
      </p>

      <p style={{ fontSize: "14px", lineHeight: 1.8, margin: "0 0 28px", opacity: 0.85 }}>
        Everything here was built while teaching myself, so parts of it are
        still rough and still changing. That is the point.
      </p>

      <div style={{ fontSize: "12px", letterSpacing: "0.08em", opacity: 0.5, marginBottom: "12px" }}>
        BUILT WITH
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "30px" }}>
        {STACK.map((tech) => (
          <span
            key={tech}
            style={{
              padding: "6px 14px",
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.06)",
              fontSize: "12px",
            }}
          >
            {tech}
          </span>
        ))}
      </div>

      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.12)",
          paddingTop: "20px",
          fontSize: "13px",
          opacity: 0.7,
          lineHeight: 1.7,
        }}
      >
        Made by Pannadhorn Rugseree (Pan)
        <br />
        A marketing student at Bangkok University who codes.
      </div>
    </div>
  );
}
