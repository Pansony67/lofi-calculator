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
 * THE CORE RULE: the back layer is ALWAYS at opacity 1. Only the front
 * layer ever animates, from 1 down to 0, revealing the back layer that
 * is already playing underneath it. If both layers are ever transparent
 * at the same time, you get a black screen - that is exactly the bug
 * this file used to have.
 *
 * Loop completion is driven by the front video's own "ended" event, not
 * by a timer alone. Timers get throttled hard in background tabs (Chrome
 * can stretch setTimeout out to a full minute in a hidden tab), which
 * left the loop stuck mid-crossfade. A media event fires regardless.
 *
 * Three independent safety nets keep the screen from ever going dead:
 *   1. "ended" while mid-swap  -> finish the swap immediately
 *   2. "ended" while NOT mid-swap -> the crossfade never fired (bad
 *      duration metadata, missed timeupdate); restart in place. A visible
 *      jump cut is bad, a black screen is worse.
 *   3. returning to the tab -> if the visible layer is paused or ended,
 *      kick it back into play.
 *
 * IMPORTANT: whenever `src` changes (the user picked a different skin),
 * both <video> elements are forced to call .load(). A <video> element
 * only reads its <source> children during the initial resource-selection
 * pass or when .load() is called explicitly - just changing the src value
 * does nothing on its own.
 */
export default function SeamlessLoopVideo({
  src,
  active,
  crossfadeSeconds = 1.2,
}: SeamlessLoopVideoProps) {
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const [frontIsA, setFrontIsA] = useState(true);
  const [fading, setFading] = useState(false);
  const swappingRef = useRef(false);

  // Ref mirrors of the two state values. Listeners below are registered
  // with narrow dependency arrays, so they would otherwise close over a
  // stale copy. This effect has no dep array on purpose - it runs after
  // every render, and being declared first it updates before the effects
  // underneath it run.
  const activeRef = useRef(active);
  const frontIsARef = useRef(frontIsA);
  useEffect(() => {
    activeRef.current = active;
    frontIsARef.current = frontIsA;
  });

  // --- Source change (user switched skin) ---------------------------
  useEffect(() => {
    const a = videoARef.current;
    const b = videoBRef.current;
    if (!a || !b) return;

    swappingRef.current = false;
    setFrontIsA(true);
    setFading(false);

    // Force both elements to pick up the new <source>.
    a.load();
    b.load();

    // Waiting for canplay avoids the classic "play() request was
    // interrupted by a new load() request" rejection, which used to leave
    // a freshly picked skin sitting on a blank frame.
    const startA = () => {
      if (!activeRef.current) return;
      a.currentTime = 0;
      a.play().catch(() => {});
    };

    if (a.readyState >= 3) {
      startA();
      return;
    }
    a.addEventListener("canplay", startA, { once: true });
    return () => a.removeEventListener("canplay", startA);
  }, [src]);

  // --- Active toggle (day <-> night) --------------------------------
  useEffect(() => {
    const a = videoARef.current;
    const b = videoBRef.current;
    if (!a || !b) return;

    if (!active) {
      a.pause();
      b.pause();
      return;
    }

    // Coming back on screen: reset to a known-good state and play.
    // Note this deliberately does NOT re-run on frontIsA changes - doing
    // that reset on every loop was what turned each crossfade into a
    // hard cut back to frame zero.
    swappingRef.current = false;
    setFading(false);
    const front = frontIsARef.current ? a : b;
    const back = frontIsARef.current ? b : a;
    back.pause();
    front.play().catch(() => {});
  }, [active]);

  // --- Crossfade loop, only wired up while this variant is on screen --
  useEffect(() => {
    if (!active) return;

    const front = frontIsA ? videoARef.current : videoBRef.current;
    const back = frontIsA ? videoBRef.current : videoARef.current;
    if (!front || !back) return;

    swappingRef.current = false;
    let backupTimer = 0;

    const finishSwap = () => {
      if (!swappingRef.current) return;
      swappingRef.current = false;
      window.clearTimeout(backupTimer);
      front.pause();
      front.currentTime = 0;
      setFading(false);
      setFrontIsA((f) => !f);
    };

    const handleTimeUpdate = () => {
      if (swappingRef.current) return;
      // Number.isFinite also rejects Infinity, which some encodes report
      // when the duration box in the container header is missing.
      if (!Number.isFinite(front.duration) || front.duration <= 0) return;
      if (front.duration - front.currentTime > crossfadeSeconds) return;

      swappingRef.current = true;
      back.currentTime = 0;
      back.play().catch(() => {});
      setFading(true);
      // Backup only. "ended" is what normally completes the swap.
      backupTimer = window.setTimeout(finishSwap, crossfadeSeconds * 1000 + 600);
    };

    const handleEnded = () => {
      if (swappingRef.current) {
        finishSwap();
        return;
      }
      front.currentTime = 0;
      front.play().catch(() => {});
    };

    const handleVisibility = () => {
      if (document.hidden || !activeRef.current) return;
      const showing = frontIsARef.current ? videoARef.current : videoBRef.current;
      if (showing && (showing.paused || showing.ended)) {
        showing.play().catch(() => {});
      }
    };

    front.addEventListener("timeupdate", handleTimeUpdate);
    front.addEventListener("ended", handleEnded);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.clearTimeout(backupTimer);
      front.removeEventListener("timeupdate", handleTimeUpdate);
      front.removeEventListener("ended", handleEnded);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [active, frontIsA, crossfadeSeconds]);

  // Back layer stays at 1 no matter what - only the front one fades.
  const opacityA = frontIsA && fading ? 0 : 1;
  const opacityB = !frontIsA && fading ? 0 : 1;

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
