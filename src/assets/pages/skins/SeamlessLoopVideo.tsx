// src/assets/pages/skins/SeamlessLoopVideo.tsx
import { useEffect, useRef, useState, type CSSProperties } from "react";

interface SeamlessLoopVideoProps {
  src: string;
  active: boolean;
  crossfadeSeconds?: number;
}

const baseVideoStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};

/**
 * Loops a video with no visible jump cut and no black flash.
 *
 * Only the outgoing ("front") video ever animates opacity, from 1 down
 * to 0. The incoming ("back") video sits at a constant opacity of 1 the
 * whole time, just stacked one z-index layer underneath.
 *
 * IMPORTANT: whenever `src` changes (the user picked a different skin),
 * both <video> elements are forced to call .load(). A <video> element
 * only reads its <source> children during the initial resource-selection
 * pass or when .load() is called explicitly - just changing the src
 * value does nothing on its own. Without this, switching skins looked
 * stuck or painfully slow, because the browser kept showing the old
 * video and only picked up the new one whenever some unrelated event
 * happened to force a reload.
 */
export default function SeamlessLoopVideo({
  src,
  active,
  crossfadeSeconds = 1.2,
}: SeamlessLoopVideoProps) {
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const [frontIsA, setFrontIsA] = useState(true);
  const [opacityA, setOpacityA] = useState(1);
  const [opacityB, setOpacityB] = useState(1);
  const swappingRef = useRef(false);

  // Reset everything whenever the source itself changes (skin switch).
  useEffect(() => {
    const a = videoARef.current;
    const b = videoBRef.current;
    if (!a || !b) return;

    swappingRef.current = false;
    setFrontIsA(true);
    setOpacityA(1);
    setOpacityB(1);

    // Force both elements to pick up the new <source>.
    a.load();
    b.load();

    if (active) {
      a.currentTime = 0;
      a.play().catch(() => {});
    }
    // Only re-run this when the source file itself changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  // Pause/resume based on whether this variant is the one on screen.
  useEffect(() => {
    const a = videoARef.current;
    const b = videoBRef.current;
    if (!a || !b) return;

    if (!active) {
      a.pause();
      b.pause();
      return;
    }

    swappingRef.current = false;
    setOpacityA(frontIsA ? 1 : 0);
    setOpacityB(frontIsA ? 0 : 1);
    const front = frontIsA ? a : b;
    front.currentTime = 0;
    front.play().catch(() => {});
  }, [active, frontIsA]);

  // Crossfade-loop logic, only wired up while this variant is active.
  useEffect(() => {
    if (!active) return;

    const front = frontIsA ? videoARef.current : videoBRef.current;
    const back = frontIsA ? videoBRef.current : videoARef.current;
    if (!front || !back) return;

    swappingRef.current = false;

    const handleTimeUpdate = () => {
      if (swappingRef.current) return;
      if (!front.duration || Number.isNaN(front.duration)) return;

      const timeLeft = front.duration - front.currentTime;
      if (timeLeft <= crossfadeSeconds) {
        swappingRef.current = true;

        back.currentTime = 0;
        back.play().catch(() => {});

        if (frontIsA) {
          setOpacityA(0);
        } else {
          setOpacityB(0);
        }

        window.setTimeout(() => {
          front.pause();
          front.currentTime = 0;
          if (frontIsA) {
            setOpacityA(1);
          } else {
            setOpacityB(1);
          }
          setFrontIsA((f) => !f);
        }, crossfadeSeconds * 1000);
      }
    };

    front.addEventListener("timeupdate", handleTimeUpdate);
    return () => front.removeEventListener("timeupdate", handleTimeUpdate);
  }, [active, frontIsA, crossfadeSeconds]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: active ? 1 : 0,
        transition: "opacity 1.2s ease",
        pointerEvents: "none",
      }}
    >
      <video
        ref={videoARef}
        muted
        playsInline
        preload="auto"
        style={{
          ...baseVideoStyle,
          opacity: opacityA,
          zIndex: frontIsA ? 2 : 1,
          transition: `opacity ${crossfadeSeconds}s linear`,
        }}
      >
        <source src={src} type="video/mp4" />
      </video>
      <video
        ref={videoBRef}
        muted
        playsInline
        preload="auto"
        style={{
          ...baseVideoStyle,
          opacity: opacityB,
          zIndex: frontIsA ? 1 : 2,
          transition: `opacity ${crossfadeSeconds}s linear`,
        }}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
