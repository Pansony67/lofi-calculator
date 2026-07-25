// src/assets/pages/skins/BackgroundPicker.tsx
import type { CSSProperties } from "react";
import { SKINS } from "./skinConfig";

interface BackgroundPickerProps {
  currentSkinId: string;
  onSelect: (skinId: string) => void;
  onClose: () => void;
  isMobile: boolean;
}

export default function BackgroundPicker({
  currentSkinId,
  onSelect,
  onClose,
  isMobile,
}: BackgroundPickerProps) {
  const panelStyle: CSSProperties = {
    position: "fixed",
    top: isMobile ? "132px" : "142px",
    right: isMobile ? "10px" : "18px",
    zIndex: 41,
    width: isMobile ? "220px" : "280px",
    padding: "12px",
    borderRadius: "16px",
    background: "rgba(20,14,28,.92)",
    border: "1px solid rgba(255,246,224,.25)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 8px 30px rgba(0,0,0,.5)",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    fontFamily: "'Julius Sans One', sans-serif",
  };

  return (
    <>
      {/* invisible full-screen backdrop - click outside the panel to close */}
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, zIndex: 39, background: "transparent" }}
      />

      <div style={panelStyle}>
        {SKINS.map((skin) => {
          const active = skin.id === currentSkinId;
          return (
            <button
              key={skin.id}
              onClick={() => {
                onSelect(skin.id);
                onClose();
              }}
              style={{
                cursor: "pointer",
                border: active ? "2px solid #fff6e0" : "2px solid transparent",
                borderRadius: "10px",
                overflow: "hidden",
                padding: 0,
                background: "rgba(0,0,0,.3)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <img
                src={skin.thumbnail}
                alt={skin.label}
                style={{
                  width: "100%",
                  height: isMobile ? "60px" : "72px",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <span
                style={{
                  fontSize: isMobile ? "9px" : "10px",
                  color: "#fff6e0",
                  padding: "4px 6px",
                  letterSpacing: ".03em",
                  textAlign: "center",
                }}
              >
                {skin.label}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
