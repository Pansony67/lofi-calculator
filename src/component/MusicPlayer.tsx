// src/component/calculator/MusicPlayer.tsx
import { useEffect, useRef, useState } from "react";

// song1-3 live in public/music, song4-9 live in public/Song (capital S)
const TRACKS = [
  { name: "Lofi Track 1", src: "/music/song1.mp3" },
  { name: "Lofi Track 2", src: "/music/song2.mp3" },
  { name: "Lofi Track 3", src: "/music/song3.mp3" },
  { name: "Lofi Track 4", src: "/Song/song4.mp3" },
  { name: "Lofi Track 5", src: "/Song/song5.mp3" },
  { name: "Lofi Track 6", src: "/Song/song6.mp3" },
  { name: "Lofi Track 7", src: "/Song/song7.mp3" },
  { name: "Lofi Track 8", src: "/Song/song8.mp3" },
  { name: "Lofi Track 9", src: "/Song/song9.mp3" },
];

// custom hook: true when the screen is phone-sized (< 640px)
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 640 : false
  );
  useEffect(() => {
    function onResize() {
      setIsMobile(window.innerWidth < 640);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isMobile;
}

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [loop, setLoop] = useState(false); // repeat the current track
  const isMobile = useIsMobile();

  // keep the audio element's volume in sync with the slider
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // keep the audio element's loop flag in sync
  useEffect(() => {
    if (audioRef.current) audioRef.current.loop = loop;
  }, [loop]);

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

  // when a track ends: if looping, the <audio loop> handles it; otherwise go next
  function handleEnded() {
    if (!loop) nextTrack();
  }

  // on desktop: floating fixed bottom-left. on mobile: static, centered, sits in normal flow.
  const wrapStyle: React.CSSProperties = isMobile
    ? {
        position: "static",
        margin: "16px auto 0",
        zIndex: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
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
      }
    : {
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
      };

  return (
    <div style={wrapStyle}>
      {/* the actual audio element */}
      <audio ref={audioRef} src={TRACKS[trackIndex].src} onEnded={handleEnded} />

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

      {/* loop / repeat toggle */}
      <button
        onClick={() => setLoop((l) => !l)}
        style={{
          ...btnStyle,
          color: loop ? "#c4b5fd" : "rgba(233,221,255,.45)",
        }}
        aria-label="Repeat current track"
        title={loop ? "Repeat: on" : "Repeat: off"}
      >
        {"\u{1F501}"}
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