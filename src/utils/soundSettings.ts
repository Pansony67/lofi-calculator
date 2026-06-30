// src/utils/soundSettings.ts
// A tiny shared switch for click sound, readable from anywhere.
// Uses localStorage so the choice is remembered after refresh.

let muted = false;

// load saved choice once when the app starts
try {
  muted = localStorage.getItem("lofi-sound-muted") === "true";
} catch {}

export function isMuted(): boolean {
  return muted;
}

export function setMuted(value: boolean): void {
  muted = value;
  try {
    localStorage.setItem("lofi-sound-muted", value ? "true" : "false");
  } catch {}
}