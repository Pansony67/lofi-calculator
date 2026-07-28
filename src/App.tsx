// src/App.tsx
import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LofiBackground from "./assets/pages/LofiBackground";
import { Calculator } from "./component/calculator/Calculator";
import "./App.css";
import { MusicPlayer } from "./component/MusicPlayer";
import { Navbar } from "./component/Navbar";
import { ContactPage } from "./component/ContactPage";
import { AboutPage } from "./component/AboutPage";
import { HomePage } from "./component/HomePage";
import { ConverterPage } from "./component/ConverterPage";
import { FinancialPage } from "./component/FinancialPage";
import { isMuted, setMuted } from "./utils/soundSettings";
import { SKINS, DEFAULT_SKIN_ID } from "./assets/pages/skins/skinConfig";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

const SKIN_STORAGE_KEY = "lofi-bg-skin";
const DARK_STORAGE_KEY = "lofi-bg-mode";

/**
 * App is the persistent shell. Everything that must survive a page
 * change lives OUTSIDE <Routes>: the background video, the navbar, and
 * the music player. Only the block inside <Routes> swaps.
 *
 * This is not a style preference - it is the whole point. If
 * LofiBackground or MusicPlayer were rendered inside a <Route>, every
 * navigation would unmount and remount them, restarting the video from
 * frame zero and killing the music mid-track.
 */
function App() {
  const [skinId, setSkinId] = useState<string>(DEFAULT_SKIN_ID);
  const [dark, setDark] = useState(false);
  const [muted, setMutedState] = useState(isMuted());
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    try {
      const savedSkin = localStorage.getItem(SKIN_STORAGE_KEY);
      if (savedSkin && SKINS.some((s) => s.id === savedSkin)) {
        setSkinId(savedSkin);
      }
      if (localStorage.getItem(DARK_STORAGE_KEY) === "dark") {
        setDark(true);
      }
    } catch {}
  }, []);

  const toggleDark = () => {
    setDark((d) => {
      const next = !d;
      try {
        localStorage.setItem(DARK_STORAGE_KEY, next ? "dark" : "light");
      } catch {}
      return next;
    });
  };

  const toggleMuted = () => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
  };

  const selectSkin = (id: string) => {
    setSkinId(id);
    try {
      localStorage.setItem(SKIN_STORAGE_KEY, id);
    } catch {}
  };

  return (
    <div className="relative min-h-screen">
      <LofiBackground skinId={skinId} dark={dark} />

      <Navbar
        dark={dark}
        onToggleDark={toggleDark}
        muted={muted}
        onToggleMuted={toggleMuted}
        skinId={skinId}
        onSelectSkin={selectSkin}
        pickerOpen={pickerOpen}
        onTogglePicker={() => setPickerOpen((o) => !o)}
        onClosePicker={() => setPickerOpen(false)}
      />

      {/* Desktop: player floats via fixed positioning. Outside Routes so
          the track keeps playing across page changes. */}
      <div className="hidden sm:block">
        <MusicPlayer />
      </div>

      {/* pt-24 clears the fixed 64px navbar so content never sits
          underneath it. pointer-events-none lets clicks pass through the
          full-screen main to reach the navbar controls in the background
          layer. pointer-events-auto re-enables clicks on real content. */}
      <main className="pointer-events-none relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-8 pt-24">
        <div className="pointer-events-auto">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/converter" element={<ConverterPage />} />
            <Route path="/financial" element={<FinancialPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            {/* Anything unknown falls back home instead of a blank screen. */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* Mobile only: player stacks under the page content. */}
        <div className="pointer-events-auto w-full max-w-[92vw] sm:hidden">
          <MusicPlayer />
        </div>
      </main>

      <Analytics />

      <SpeedInsights />
    </div>
  );
}

export default App;
