// src/component/calculator/ContactLinks.tsx
import { useEffect, useState } from "react";

const LINKS = [
  { label: "GitHub", href: "https://github.com/Pansony67" },
  { label: "Email", href: "mailto:Pansony67@gmail.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/pannadhorn-rugseree-90a8b6403/" },
];

// custom hook: true when the screen is phone-sized (< 640px)
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 640 : false
  );
  useEffect(() => {
    function onResize() {
      setIsMobile(window.innerWidth < 640);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isMobile;
}

export function ContactLinks() {
  const isMobile = useIsMobile();

  // on desktop: floating fixed bottom-center. on mobile: static, sits below the player in normal flow.
  const wrap: React.CSSProperties = isMobile
    ? {
        position: "static",
        margin: "12px auto 20px",
        zIndex: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "14px",
        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
        fontSize: "13px",
        letterSpacing: ".03em",
      }
    : {
        position: "fixed",
        top: "18px",
        left: "18px",
        zIndex: 20,
        display: "flex",
        alignItems: "center",
        gap: "14px",
        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
        fontSize: "13px",
        letterSpacing: ".03em",
      };

  // Layered shadow works on both bright (day) and dark (night) video
  // backgrounds at once: the tight dark shadow keeps letters readable
  // against bright sky/sand, the wider soft glow lifts them off a dark
  // night scene. Neither layer alone covers both cases.
  const linkStyle: React.CSSProperties = {
    color: "rgba(255,255,255,.95)",
    textDecoration: "none",
    fontWeight: 600,
    textShadow:
      "0 1px 3px rgba(0,0,0,.85), 0 0 2px rgba(0,0,0,.9), 0 0 12px rgba(255,255,255,.35)",
    transition: "color .2s ease, text-shadow .2s ease",
  };

  const dotStyle: React.CSSProperties = {
    color: "rgba(255,255,255,.6)",
    textShadow: "0 1px 3px rgba(0,0,0,.85), 0 0 8px rgba(255,255,255,.25)",
  };

  return (
    <div style={wrap}>
      <a href={LINKS[0].href} target="_blank" rel="noopener noreferrer" style={linkStyle}>
        {LINKS[0].label}
      </a>
      <span style={dotStyle}>·</span>
      <a href={LINKS[1].href} target="_blank" rel="noopener noreferrer" style={linkStyle}>
        {LINKS[1].label}
      </a>
      <span style={dotStyle}>·</span>
      <a href={LINKS[2].href} target="_blank" rel="noopener noreferrer" style={linkStyle}>
        {LINKS[2].label}
      </a>
    </div>
  );
}