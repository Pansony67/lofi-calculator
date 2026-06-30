// src/component/calculator/ContactLinks.tsx

const LINKS = [
  { label: "GitHub", href: "https://github.com/Pansony67" },
  { label: "Email", href: "mailto:Pansony67@gmail.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/pannadhorn-rugseree-90a8b6403/" },
];

export function ContactLinks() {
  const wrap = {
    position: "fixed" as const,
    bottom: "18px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 20,
    display: "flex",
    alignItems: "center",
    gap: "14px",
    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
    fontSize: "13px",
    letterSpacing: ".03em",
  };

  const linkStyle = {
    color: "rgba(233,221,255,.7)",
    textDecoration: "none",
  };

  return (
    <div style={wrap}>
      <a href={LINKS[0].href} target="_blank" rel="noopener noreferrer" style={linkStyle}>
        {LINKS[0].label}
      </a>
      <span style={{ color: "rgba(167,139,250,.4)" }}>·</span>
      <a href={LINKS[1].href} target="_blank" rel="noopener noreferrer" style={linkStyle}>
        {LINKS[1].label}
      </a>
      <span style={{ color: "rgba(167,139,250,.4)" }}>·</span>
      <a href={LINKS[2].href} target="_blank" rel="noopener noreferrer" style={linkStyle}>
        {LINKS[2].label}
      </a>
    </div>
  );
}