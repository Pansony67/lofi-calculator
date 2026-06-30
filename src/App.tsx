import LofiBackground from "./assets/pages/LofiBackground";
import { Calculator } from "./component/calculator/Calculator";


import "./App.css";
import { MusicPlayer } from "./component/MusicPlayer";
import { ContactLinks } from "./component/calculator/ContactLinks";

function App() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <LofiBackground />
       <MusicPlayer />
       <ContactLinks />
      <main className="pointer-events-none relative z-10 flex min-h-screen items-center justify-center">
        <div className="pointer-events-auto">
          <Calculator />
        </div>
      </main>
    </div>
  );
}

export default App;


