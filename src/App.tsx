import { useState, useEffect } from 'react';
import Header from './components/Header';
import LandingView from './components/LandingView';
import DashboardView from './components/DashboardView';
import HUDSimulatorView from './components/HUDSimulatorView';
import AICommandView from './components/AICommandView';
import Footer from './components/Footer';
import { Screen } from './types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('Landing');

  // Scroll to top on screen transitions
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentScreen]);

  return (
    <div className="flex flex-col min-h-screen bg-[#fbf9f9] text-black antialiased">
      {/* Top Navbar */}
      <Header currentScreen={currentScreen} onScreenChange={setCurrentScreen} />

      {/* Main Switchboard Screen Views */}
      <main className="flex-grow">
        {currentScreen === 'Landing' && (
          <LandingView onScreenChange={setCurrentScreen} />
        )}
        
        {currentScreen === 'Dashboard' && (
          <DashboardView onScreenChange={setCurrentScreen} />
        )}
        
        {currentScreen === 'HUDSimulator' && (
          <HUDSimulatorView onScreenChange={setCurrentScreen} />
        )}
        
        {currentScreen === 'AICommand' && (
          <AICommandView onScreenChange={setCurrentScreen} />
        )}
      </main>

      {/* Full-bleed image footer — last element on the site */}
      <Footer />
    </div>
  );
}

