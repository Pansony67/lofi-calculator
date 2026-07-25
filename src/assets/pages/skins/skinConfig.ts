// src/assets/pages/skins/skinConfig.ts
export type SkinType = "procedural" | "video";

export interface SkinMeta {
  id: string;
  label: string;
  type: SkinType;
  // Static thumbnail shown in the Background picker grid. Always a small
  // image, never a live video, so the picker stays cheap to render.
  thumbnail: string;
  // Only set for type: "video" skins.
  video?: {
    day: string;
    night: string;
  };
}

// Add a new entry here whenever a new skin is built. Both the picker
// grid and the orchestrator's renderSkin() pick it up automatically.
export const SKINS: SkinMeta[] = [
  {
    id: "aurora",
    label: "Aurora Night",
    type: "video",
    thumbnail: "/backgrounds/thumbs/aurora.jpg",
    video: {
      day: "/backgrounds/aurora-day.mp4",
      night: "/backgrounds/aurora-night.mp4",
    },
  },
  {
    id: "beach",
    label: "Tropical Beach",
    type: "video",
    thumbnail: "/backgrounds/thumbs/beach.jpg",
    video: {
      day: "/backgrounds/beach-day.mp4",
      night: "/backgrounds/beach-night.mp4",
    },
  },
  {
    id: "tokyo",
    label: "Tokyo Lofi",
    type: "video",
    thumbnail: "/backgrounds/thumbs/tokyo.jpg",
    video: {
      day: "/backgrounds/tokyo-day.mp4",
      night: "/backgrounds/tokyo-night.mp4",
    },
  },
];

export const DEFAULT_SKIN_ID: string = SKINS[0].id;
