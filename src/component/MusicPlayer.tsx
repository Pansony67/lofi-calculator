// src/component/calculator/LofiPlayer.tsx
import { useEffect, useRef, useState } from "react";

// the 3 songs you put in public/music
const TRACKS = [
  { name: "Lofi Track 1", src: "/music/song1.mp3" },
  { name: "Lofi Track 2", src: "/music/song2.mp3" },
  { name: "Lofi Track 3", src: "/music/song3.mp3" },
];

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

  // keep the audio element's volume in sync with the slider
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // when the track changes, load it and (if we were playing) keep playing
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.load();
    if (playing) {
      audio.play().catch(() => {});
    }
  }, [trackIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().catch(() => {});
      setPlaying(true);
    }
  }

  function nextTrack() {
    setTrackIndex((i) => (i + 1) % TRACKS.length);
  }

  function prevTrack() {
    setTrackIndex((i) => (i - 1 + TRACKS.length) % TRACKS.length);
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "18px",
        left: "18px",
        zIndex: 20,
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "10px 16px",
        borderRadius: "999px",
        background: "rgba(20,12,30,.75)",
        border: "1px solid rgba(167,139,250,.35)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 4px 20px rgba(0,0,0,.4)",
        color: "#e9ddff",
        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
        fontSize: "13px",
      }}
    >
      {/* the actual audio element. when a track ends, go to the next one. */}
      <audio ref={audioRef} src={TRACKS[trackIndex].src} onEnded={nextTrack} />

      {/* previous */}
      <button onClick={prevTrack} style={btnStyle} aria-label="Previous track">
        {"\u23EE"}
      </button>

      {/* play / pause */}
      <button onClick={togglePlay} style={btnStyle} aria-label="Play or pause">
        {playing ? "\u23F8" : "\u25B6"}
      </button>

      {/* next */}
      <button onClick={nextTrack} style={btnStyle} aria-label="Next track">
        {"\u23ED"}
      </button>

      {/* track name */}
      <span style={{ minWidth: "90px", opacity: 0.9 }}>
        {TRACKS[trackIndex].name}
      </span>

      {/* volume */}
      <span style={{ fontSize: "14px" }}>{"\u{1F50A}"}</span>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        style={{ width: "80px", accentColor: "#a78bfa", cursor: "pointer" }}
        aria-label="Music volume"
      />
    </div>
  );
}

// shared button style
const btnStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  color: "#e9ddff",
  fontSize: "16px",
  cursor: "pointer",
  padding: "2px 4px",
  lineHeight: 1,
};