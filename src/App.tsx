import { Calculator } from "./component/calculator/Calculator";

import "./App.css";
import { MusicPlayer } from "./component/MusicPlayer";
import { ContactLinks } from "./component/calculator/ContactLinks";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import LofiBackground from "./assets/pages/LofiBackground";

// NEW


function App() {
  return (
    <div className="relative min-h-screen">
      {/* Background Manager */}
      <LofiBackground />

      {/* Desktop: player + links float via fixed positioning */}
      <div className="hidden sm:block">
        <MusicPlayer />
        <ContactLinks />
      </div>

      {/* Main Content */}
      <main className="pointer-events-none relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-8">
        <div className="pointer-events-auto">
          <Calculator />
        </div>

        {/* Mobile only */}
        <div className="pointer-events-auto w-full max-w-[92vw] sm:hidden">
          <MusicPlayer />
          <ContactLinks />
        </div>
      </main>

      <Analytics />
      <SpeedInsights />
    </div>
  );
}

export default App;