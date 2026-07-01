import LofiBackground from "./assets/pages/LofiBackground";
import { Calculator } from "./component/calculator/Calculator";


import "./App.css";
import { MusicPlayer } from "./component/MusicPlayer";
import { ContactLinks } from "./component/calculator/ContactLinks";

function App() {
  return (
    <div className="relative min-h-screen">
      <LofiBackground />

      {/* Desktop: player + links float via fixed positioning (rendered here).
          Mobile: they render in normal flow below the calculator instead — see the mobile block. */}
      <div className="hidden sm:block">
        <MusicPlayer />
        <ContactLinks />
      </div>

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-8">
        <Calculator />

        {/* Mobile only: player + links stack under the calculator, in normal flow */}
        <div className="w-full max-w-[92vw] sm:hidden">
          <MusicPlayer />
          <ContactLinks />
        </div>
      </main>
    </div>
  );
}

export default App;


