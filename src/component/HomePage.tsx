// src/component/HomePage.tsx
import { Link } from "react-router-dom";

/**
 * Landing page, built like an indie game title screen.
 *
 * Fonts here are deliberately different from the rest of the site:
 * 'Press Start 2P' (pixel) for the title and button, 'IBM Plex Mono'
 * for everything else. The other pages use 'Julius Sans One'.
 *
 * To change the wording: edit the text below directly.
 */

const FEATURES = [
  "NPV and IRR charts that update as you type",
  "Nine lofi tracks on loop",
  "Three animated backgrounds, day and night",
];

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=IBM+Plex+Mono:wght@400;500&display=swap');

@keyframes lc-blink {
  0%, 49%  { opacity: 1; }
  50%, 100% { opacity: 0; }
}

.lc-home-cursor { animation: lc-blink 1.1s step-end infinite; }

.lc-home-start:hover {
  background: rgba(196,181,253,0.18);
  border-color: #c4b5fd;
}

@media (prefers-reduced-motion: reduce) {
  .lc-home-cursor { animation: none; }
}
`;

export function HomePage() {
  return (
    <div style={{ width: "min(640px, 92vw)", textAlign: "center", color: "#fff6e0" }}>
      <style>{FONTS}</style>

      <h1
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "clamp(15px, 4vw, 28px)",
          lineHeight: 1.7,
          margin: "0 0 22px",
          background: "linear-gradient(90deg, #f9a8d4, #c4b5fd)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        LOFI
        <br />
        CALCULATOR
      </h1>

      <p
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "14px",
          opacity: 0.75,
          margin: "0 0 40px",
        }}
      >
        A calculator you can leave open while you study.
      </p>

      <Link
        to="/calculator"
        className="lc-home-start"
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "12px",
          display: "inline-block",
          padding: "18px 28px",
          borderRadius: "12px",
          border: "2px solid rgba(196,181,253,0.6)",
          background: "rgba(20,10,32,0.6)",
          color: "#fff6e0",
          textDecoration: "none",
          transition: "background 0.25s ease, border-color 0.25s ease",
        }}
      >
        PRESS START <span className="lc-home-cursor">_</span>
      </Link>

      <div
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "13px",
          lineHeight: 2.1,
          opacity: 0.6,
          marginTop: "48px",
        }}
      >
        {FEATURES.map((line) => (
          <div key={line}>
            <span style={{ color: "#c4b5fd", marginRight: "10px" }}>+</span>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
