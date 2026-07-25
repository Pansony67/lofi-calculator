// src/assets/pages/skins/VideoSkin.tsx
import SeamlessLoopVideo from "./SeamlessLoopVideo";

interface VideoSkinProps {
  day: string;
  night: string;
  dark: boolean;
}

export default function VideoSkin({ day, night, dark }: VideoSkinProps) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        zIndex: 0,
        background: "#000",
      }}
    >
      <SeamlessLoopVideo src={day} active={!dark} />
      <SeamlessLoopVideo src={night} active={dark} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.15)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}