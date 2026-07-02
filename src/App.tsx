import LofiBackground from "./assets/pages/LofiBackground";
import { Calculator } from "./component/calculator/Calculator";


import "./App.css";
import { MusicPlayer } from "./component/MusicPlayer";
import { ContactLinks } from "./component/calculator/ContactLinks";


function App() {
  return (
    <div className="relative min-h-screen">
      <LofiBackground />

      {/* Desktop: player + links float via fixed positioning */}
      <div className="hidden sm:block">
        <MusicPlayer />
        <ContactLinks />
      </div>

      {/* pointer-events-none lets clicks pass through the full-screen main
          to reach the LIGHT/SOUND buttons in the background layer.
          pointer-events-auto re-enables clicks on the actual content. */}
      <main className="pointer-events-none relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-8">
        <div className="pointer-events-auto">
          <Calculator />
        </div>

        {/* Mobile only: player + links stack under the calculator */}
        <div className="pointer-events-auto w-full max-w-[92vw] sm:hidden">
          <MusicPlayer />
          <ContactLinks />
        </div>
      </main>
    </div>
  );
}

export default App;
