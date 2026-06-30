// src/hooks/useClickSound.ts
import { useCallback, useRef } from "react";
import { isMuted } from "../utils/soundSettings";

export function useClickSound() {
  // load the sound file once and keep it
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (audioRef.current === null) {
    audioRef.current = new Audio("/sounds/click.mp3");
    audioRef.current.volume = 0.4; // keep it soft for the lofi vibe
  }

  const playClick = useCallback(() => {
    if (isMuted()) return; // user turned sound off
    const base = audioRef.current;
    if (!base) return;

    // Clone the sound each time so fast presses don't cut each other off.
    const sound = base.cloneNode() as HTMLAudioElement;
    sound.volume = base.volume;
    sound.play().catch(() => {
      // browsers block audio until the user interacts — safe to ignore
    });
  }, []);

  return playClick;
}