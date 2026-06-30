import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { isMuted, setMuted } from "../../utils/soundSettings";

/**
 * Lofi animated calculator background.
 * Renders a full-screen fixed layer. Put your calculator UI in front of it
 * (give the calculator a higher z-index, or render it after this component).
 *
 *   <LofiBackground />
 *   <div style={{ position: "relative", zIndex: 1 }}>{/* your calculator *​/}</div>
 */

const KEYFRAMES = `
@import url('https://fonts.googleapis.com/css2?family=Julius+Sans+One&display=swap');
@keyframes lofi-twinkle { 0%,100% { opacity:.15 } 50% { opacity:.95 } }
@keyframes lofi-stardrift { 0%,100% { transform: translate(0,0) } 50% { transform: translate(var(--dx), var(--dy)) } }
@keyframes lofi-glow { 0%,100% { opacity:.55 } 50% { opacity:.9 } }
@keyframes lofi-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-5px) } }
@keyframes lofi-meteor {
  0% { transform: translate(0,0); opacity:0 }
  1.5% { opacity:1 }
  8% { transform: translate(var(--mx), var(--my)); opacity:0 }
  100% { transform: translate(var(--mx), var(--my)); opacity:0 }
}
`;

export default function LofiBackground() {
  const [dark, setDark] = useState(false);
  const [muted, setMutedState] = useState(isMuted());

  useEffect(() => {
    try {
      if (localStorage.getItem("lofi-bg-mode") === "dark") setDark(true);
    } catch {}
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  const toggle = () => {
    setDark((d) => {
      const next = !d;
      try {
        localStorage.setItem("lofi-bg-mode", next ? "dark" : "light");
      } catch {}
      return next;
    });
  };

  const { stars, meteors } = useMemo(() => {
    let seed = 7;
    const rnd = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    // stars
    const starCount = dark ? 130 : 46;
    const stars = Array.from({ length: starCount }, (_, i) => {
      const size = (dark ? 0.8 : 1) + rnd() * (dark ? 2.4 : 2);
      const style: CSSProperties = {
        position: "absolute",
        left: rnd() * 100 + "%",
        top: rnd() * (dark ? 78 : 48) + "%",
        width: size + "px",
        height: size + "px",
        borderRadius: "50%",
        background: "#fff6e0",
        boxShadow: `0 0 ${dark ? 6 : 4}px rgba(255,246,224,.85)`,
        ["--dx" as never]: (rnd() * 2 - 1) * 8 + "px",
        ["--dy" as never]: (rnd() * 2 - 1) * 8 + "px",
        animation: `lofi-twinkle ${3 + rnd() * 5}s ease-in-out infinite ${rnd() * 6}s, lofi-stardrift ${7 + rnd() * 11}s ease-in-out infinite ${rnd() * 8}s`,
      };
      return <div key={i} style={style} />;
    });

    // meteors (dark mode only)
    let meteors: React.ReactNode = null;
    if (dark) {
      meteors = Array.from({ length: 2 }, (_, i) => {
        const angle = 32 + rnd() * 10;
        const rad = (angle * Math.PI) / 180;
        const ux = -Math.cos(rad);
        const uy = Math.sin(rad);
        const dist = 420 + rnd() * 220;
        const dur = 15 + rnd() * 7;
        const delay = i * 8 + rnd() * 4;
        const len = 150 + rnd() * 90;
        const tailAngle = 180 - angle;
        const wrap: CSSProperties = {
          position: "absolute",
          left: 35 + rnd() * 55 + "%",
          top: 4 + rnd() * 24 + "%",
          width: "3px",
          height: "3px",
          ["--mx" as never]: dist * ux + "px",
          ["--my" as never]: dist * uy + "px",
          animation: `lofi-meteor ${dur}s cubic-bezier(.25,.6,.35,1) infinite ${delay}s backwards`,
        };
        return (
          <div key={i} style={wrap}>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "1px",
                width: len + "px",
                height: "4px",
                transformOrigin: "left center",
                transform: `rotate(${tailAngle}deg)`,
                background:
                  "linear-gradient(90deg, rgba(150,190,255,0) 0%, rgba(170,205,255,.18) 70%, rgba(210,230,255,.4) 100%)",
                filter: "blur(2px)",
                borderRadius: "4px",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "1px",
                left: "1px",
                width: len + "px",
                height: "1.4px",
                transformOrigin: "left center",
                transform: `rotate(${tailAngle}deg)`,
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(195,220,255,.5) 72%, rgba(235,245,255,.95) 94%, #fff 100%)",
                filter: "blur(.35px)",
                borderRadius: "2px",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "-1px",
                left: "-1px",
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: "#f4fbff",
                boxShadow:
                  "0 0 6px 2px rgba(190,225,255,.95), 0 0 14px 5px rgba(150,200,255,.45)",
              }}
            />
          </div>
        );
      });
    }

    return { stars, meteors };
  }, [dark]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        fontFamily: "'Julius Sans One', sans-serif",
        zIndex: 0,
        background:
          "linear-gradient(180deg,#2a1f3d 0%,#3d2b4f 30%,#6b4063 58%,#c2716b 82%,#e8a07a 100%)",
        transition: "background .9s ease",
      }}
    >
      <style>{KEYFRAMES}</style>

      {/* night sky overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transition: "opacity .9s ease",
          opacity: dark ? 1 : 0,
          background:
            "linear-gradient(180deg,#0a0712 0%,#120c20 34%,#1c1430 62%,#2a1c3e 84%,#34244a 100%)",
        }}
      />

      {/* haze */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: dark ? 0.35 : 1,
          background:
            "radial-gradient(120% 80% at 70% 18%, rgba(255,214,170,.18), transparent 55%)",
        }}
      />

      {/* meteors */}
      {meteors && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {meteors}
        </div>
      )}

      {/* stars */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {stars}
      </div>

      {/* mountain */}
      <svg
        viewBox="0 0 1440 700"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          height: "70%",
          display: "block",
        }}
      >
        <defs>
          <linearGradient id="lofiHill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a1d40" />
            <stop offset="55%" stopColor="#1a1228" />
            <stop offset="100%" stopColor="#08060f" />
          </linearGradient>
          <linearGradient id="lofiHillPink" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9c6178" />
            <stop offset="52%" stopColor="#6e4259" />
            <stop offset="100%" stopColor="#2e1d2f" />
          </linearGradient>
        </defs>
        <path
          d="M0,700 L0,360 C120,322 220,270 340,270 C460,270 520,400 640,400 C760,400 820,282 940,272 C1060,262 1130,168 1240,112 C1320,70 1382,82 1440,98 L1440,700 Z"
          fill={dark ? "url(#lofiHillPink)" : "url(#lofiHill)"}
        />
      </svg>

      {/* moon */}
      <div
        style={{
          position: "absolute",
          top: "11%",
          right: "16%",
          width: "92px",
          height: "92px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 38% 35%, #fff4e0, #f3d6a8)",
          boxShadow: "0 0 60px 12px rgba(255,231,194,.35)",
          animation:
            "lofi-glow 7s ease-in-out infinite, lofi-float 9s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "13%",
          right: "13%",
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          background: dark ? "#120c20" : "#2a1f3d",
          opacity: 0.6,
          transition: "background .9s ease",
        }}
      />

      {/* film grain */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.05,
          mixBlendMode: "overlay",
          backgroundImage:
            "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>')",
        }}
      />

      {/* sound on / mute toggle */}
      <button
        onClick={() => {
          const next = !muted;
          setMuted(next);
          setMutedState(next);
        }}
        style={{
          position: "absolute",
          top: "62px",
          right: "18px",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "9px 16px",
          borderRadius: "999px",
          border: `1px solid ${dark ? "rgba(255,238,200,.9)" : "rgba(255,246,224,.35)"}`,
          background: dark ? "rgba(255,238,200,.92)" : "rgba(30,18,44,.55)",
          color: dark ? "#1a1020" : "#fff6e0",
          backdropFilter: "blur(6px)",
          fontFamily: "'Julius Sans One', sans-serif",
          fontSize: "13px",
          letterSpacing: ".04em",
          cursor: "pointer",
          boxShadow: "0 2px 14px rgba(0,0,0,.3)",
          transition: "background .4s ease, color .4s ease, border-color .4s ease",
        }}
      >
        <span style={{ fontSize: "15px" }}>{muted ? "\u{1F507}" : "\u{1F50A}"}</span>
        <span>{muted ? "Muted" : "Sound"}</span>
      </button>

      {/* light / dark toggle */}
      <button
        onClick={toggle}
        style={{
          position: "absolute",
          top: "18px",
          right: "18px",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "9px 16px",
          borderRadius: "999px",
          border: `1px solid ${dark ? "rgba(255,238,200,.9)" : "rgba(255,246,224,.35)"}`,
          background: dark ? "rgba(255,238,200,.92)" : "rgba(30,18,44,.55)",
          color: dark ? "#1a1020" : "#fff6e0",
          backdropFilter: "blur(6px)",
          fontFamily: "'Julius Sans One', sans-serif",
          fontSize: "13px",
          letterSpacing: ".04em",
          cursor: "pointer",
          boxShadow: "0 2px 14px rgba(0,0,0,.3)",
          transition: "background .4s ease, color .4s ease, border-color .4s ease",
        }}
      >
        <span style={{ fontSize: "15px" }}>{dark ? "\u2600" : "\u263e"}</span>
        <span>{dark ? "Light" : "Dark"}</span>
      </button>
    </div>
  );
}
