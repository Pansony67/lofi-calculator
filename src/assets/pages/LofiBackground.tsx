// src/assets/pages/LofiBackground.tsx
import { SKINS } from "./skins/skinConfig";
import AuroraNightSkin from "./skins/AuroraNightSkin";
import VideoSkin from "./skins/VideoSkin";

/**
 * Background renderer - pure presentation, no state of its own.
 *
 * All controls (dark/light, sound, background picker) now live in
 * Navbar.tsx, and all state (skinId, dark, muted, pickerOpen) lives in
 * App.tsx. This component only answers one question: given a skin id and
 * a dark flag, what do I paint behind the app?
 *
 * To add a new skin later:
 *   1. Add day/night video files under public/backgrounds/
 *   2. Add a thumbnail under public/backgrounds/thumbs/
 *   3. Add one entry to SKINS in skinConfig.ts
 *   VideoSkin and BackgroundPicker both pick it up automatically.
 */

interface LofiBackgroundProps {
  skinId: string;
  dark: boolean;
}

export default function LofiBackground({ skinId, dark }: LofiBackgroundProps) {
  const meta = SKINS.find((s) => s.id === skinId) ?? SKINS[0];

  if (meta.type === "video" && meta.video) {
    return <VideoSkin day={meta.video.day} night={meta.video.night} dark={dark} />;
  }

  // Fallback for any non-video skin entry (procedural skins).
  return <AuroraNightSkin dark={dark} />;
}
