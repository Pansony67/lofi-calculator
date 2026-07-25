// src/assets/pages/LofiBackground.tsx
import { useEffect, useState, type CSSProperties } from "react";
import { isMuted, setMuted } from "../../utils/soundSettings";
import { useIsMobileBg } from "./skins/useIsMobileBg";
import { SKINS, DEFAULT_SKIN_ID } from "./skins/skinConfig";
import AuroraNightSkin from "./skins/AuroraNightSkin";
import VideoSkin from "./skins/VideoSkin";
import BackgroundPicker from "./skins/BackgroundPicker";

const GLOBAL_STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Julius+Sans+One&display=swap');
`;

const SKIN_STORAGE_KEY = "lofi-bg-skin";
const DARK_STORAGE_KEY = "lofi-bg-mode";

function renderSkin(skinId: string, dark: boolean) {
  const meta = SKINS.find((s) => s.id === skinId) ?? SKINS[0];
  if (meta.type === "video" && meta.video) {
    return <VideoSkin day={meta.video.day} night={meta.video.night} dark={dark} />;
  }
  return <AuroraNightSkin dark={dark} />;
}

export default function LofiBackground() {
  const [skinId, setSkinId] = useState<string>(DEFAULT_SKIN_ID);
  const [dark, setDark] = useState(false);
  const [muted, setMutedState] = useState(isMuted());
  const [pickerOpen, setPickerOpen] = useState(false);
  const isMobile = useIsMobileBg();

  useEffect(() => {
    try {
      const savedSkin = localStorage.getItem(SKIN_STORAGE_KEY);
      if (savedSkin && SKINS.some((s) => s.id === savedSkin)) {
        setSkinId(savedSkin);
      }
      if (localStorage.getItem(DARK_STORAGE_KEY) === "dark") {
        setDark(true);
      }
    } catch {}
  }, []);

  const toggleDark = () => {
    setDark((d) => {
      const next = !d;
      try {
        localStorage.setItem(DARK_STORAGE_KEY, next ? "dark" : "light");
      } catch {}
      return next;
    });
  };

  const selectSkin = (id: string) => {
    setSkinId(id);
    try {
      localStorage.setItem(SKIN_STORAGE_KEY, id);
    } catch {}
  };

  // positioning-only wrapper: not a visual container, just stacks the
  // three pill buttons with even gap and a shared right edge
  const stackStyle: CSSProperties = {
    position: "fixed",
    top: isMobile ? "12px" : "18px",
    right: isMobile ? "10px" : "18px",
    zIndex: 40,
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: "10px",
  };

  const buttonStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "8px",
    padding: isMobile ? "7px 12px" : "9px 16px",
    borderRadius: "999px",
    border: `1px solid ${dark ? "rgba(255,238,200,.9)" : "rgba(255,246,224,.35)"}`,
    background: dark ? "rgba(255,238,200,.92)" : "rgba(30,18,44,.55)",
    color: dark ? "#1a1020" : "#fff6e0",
    backdropFilter: "blur(6px)",
    fontFamily: "'Julius Sans One', sans-serif",
    fontSize: isMobile ? "11px" : "13px",
    letterSpacing: ".04em",
    cursor: "pointer",
    boxShadow: "0 2px 14px rgba(0,0,0,.3)",
    transition: "background .4s ease, color .4s ease, border-color .4s ease",
    width: "100%",
    whiteSpace: "nowrap",
  };

  const iconSize = isMobile ? "13px" : "15px";

  return (
    <>
      <style>{GLOBAL_STYLE}</style>

      {renderSkin(skinId, dark)}

      <div style={stackStyle}>
        <button onClick={toggleDark} style={buttonStyle}>
          <span style={{ fontSize: iconSize }}>{dark ? "\u2600" : "\u263e"}</span>
          <span>{dark ? "Light" : "Dark"}</span>
        </button>

        <button
          onClick={() => {
            const next = !muted;
            setMuted(next);
            setMutedState(next);
          }}
          style={buttonStyle}
        >
          <span style={{ fontSize: iconSize }}>
            {muted ? "\u{1F507}" : "\u{1F50A}"}
          </span>
          <span>{muted ? "Muted" : "Sound"}</span>
        </button>

        <button onClick={() => setPickerOpen((o) => !o)} style={buttonStyle}>
          <span style={{ fontSize: iconSize }}>{"\u{1F3A8}"}</span>
          <span>Background</span>
        </button>
      </div>

      {pickerOpen && (
        <BackgroundPicker
          currentSkinId={skinId}
          onSelect={selectSkin}
          onClose={() => setPickerOpen(false)}
          isMobile={isMobile}
        />
      )}
    </>
  );
}