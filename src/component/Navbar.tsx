// src/component/Navbar.tsx
import type { CSSProperties } from "react";
import { NavLink } from "react-router-dom";
import BackgroundPicker from "../assets/pages/skins/BackgroundPicker";

interface NavbarProps {
  dark: boolean;
  onToggleDark: () => void;
  muted: boolean;
  onToggleMuted: () => void;
  skinId: string;
  onSelectSkin: (id: string) => void;
  pickerOpen: boolean;
  onTogglePicker: () => void;
  onClosePicker: () => void;
}

const GLOBAL_STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Julius+Sans+One&display=swap');
`;

// `to: null` means the page does not exist yet. Those render dimmed and
// do nothing, so the nav never lies about where it can take you. Give a
// link a real path here the moment its page is built.
const NAV_LINKS: { label: string; to: string | null }[] = [
  { label: "Home", to: "/" },
  { label: "Calculator", to: "/calculator" },
  { label: "Converter", to: "/converter" },
  { label: "Financial", to: "/financial" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const baseLinkStyle: CSSProperties = {
  fontSize: "13px",
  textDecoration: "none",
  paddingBottom: "4px",
  transition: "color .25s ease, border-color .25s ease",
};

export function Navbar({
  dark,
  onToggleDark,
  muted,
  onToggleMuted,
  skinId,
  onSelectSkin,
  pickerOpen,
  onTogglePicker,
  onClosePicker,
}: NavbarProps) {
  const barStyle: CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: "64px",
    zIndex: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    background: "rgba(20,10,32,0.55)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    fontFamily: "'Julius Sans One', sans-serif",
  };

  const logoWrapStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexShrink: 0,
  };

  const logoImgStyle: CSSProperties = {
    width: "34px",
    height: "34px",
    borderRadius: "10px",
    objectFit: "cover",
    flexShrink: 0,
  };

  const brandStyle: CSSProperties = {
    fontWeight: 700,
    fontSize: "15px",
    letterSpacing: ".04em",
    background: "linear-gradient(90deg, #f9a8d4, #c4b5fd)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    whiteSpace: "nowrap",
  };

  const controlsWrapStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexShrink: 0,
  };

  const pillStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 14px",
    borderRadius: "999px",
    border: `1px solid ${dark ? "rgba(255,238,200,.9)" : "rgba(255,246,224,.25)"}`,
    background: dark ? "rgba(255,238,200,.92)" : "rgba(255,255,255,0.08)",
    color: dark ? "#1a1020" : "#fff6e0",
    fontSize: "12px",
    letterSpacing: ".03em",
    cursor: "pointer",
    whiteSpace: "nowrap",
  };

  return (
    <>
      <style>{GLOBAL_STYLE}</style>

      <nav style={barStyle}>
        <NavLink to="/" style={{ ...logoWrapStyle, textDecoration: "none" }}>
          <img src="/favicon-180.png" alt="Lofi Calculator logo" style={logoImgStyle} />
          <span style={brandStyle}>LOFI CALCULATOR</span>
        </NavLink>

        <div className="hidden md:flex" style={{ alignItems: "center", gap: "26px" }}>
          {NAV_LINKS.map(({ label, to }) =>
            to ? (
              <NavLink
                key={label}
                to={to}
                end
                style={({ isActive }) => ({
                  ...baseLinkStyle,
                  color: isActive ? "#f9a8d4" : "rgba(255,255,255,0.75)",
                  borderBottom: isActive ? "2px solid #f9a8d4" : "2px solid transparent",
                })}
              >
                {label}
              </NavLink>
            ) : (
              <span
                key={label}
                title="Coming soon"
                style={{
                  ...baseLinkStyle,
                  color: "rgba(255,255,255,0.75)",
                  borderBottom: "2px solid transparent",
                  opacity: 0.4,
                  cursor: "default",
                }}
              >
                {label}
              </span>
            )
          )}
        </div>

        <div style={controlsWrapStyle}>
          <button onClick={onToggleDark} style={pillStyle}>
            <span>{dark ? "\u2600" : "\u263e"}</span>
            <span className="hidden sm:inline">{dark ? "Light" : "Dark Mode"}</span>
          </button>
          <button onClick={onToggleMuted} style={pillStyle}>
            <span>{muted ? "\u{1F507}" : "\u{1F50A}"}</span>
            <span className="hidden sm:inline">{muted ? "Muted" : "Sound On"}</span>
          </button>
          <button onClick={onTogglePicker} style={pillStyle}>
            <span>{"\u{1F3A8}"}</span>
            <span className="hidden sm:inline">Background</span>
          </button>
        </div>
      </nav>

      {pickerOpen && (
        <BackgroundPicker
          currentSkinId={skinId}
          onSelect={onSelectSkin}
          onClose={onClosePicker}
          isMobile={false}
        />
      )}
    </>
  );
}
