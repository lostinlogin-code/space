import React, { useState } from 'react';
import { Screen } from '../types';
import { Shield, Radio, Eye, Cpu, Menu, X, ArrowUpRight } from 'lucide-react';

interface HeaderProps {
  currentScreen: Screen;
  onScreenChange: (screen: Screen) => void;
}

export default function Header({ currentScreen, onScreenChange }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { screen: Screen; label: string; icon: React.ReactNode }[] = [
    { screen: 'Landing', label: 'Home / Systems', icon: <Shield className="w-3.5 h-3.5" /> },
    { screen: 'Dashboard', label: 'Telemetry Console', icon: <Radio className="w-3.5 h-3.5" /> },
    { screen: 'HUDSimulator', label: 'Helmet HUD System', icon: <Eye className="w-3.5 h-3.5" /> },
    { screen: 'AICommand', label: 'Vanguard Command AI', icon: <Cpu className="w-3.5 h-3.5" /> },
  ];

  return (
    <nav className="flex items-center justify-between px-6 md:px-12 h-16 bg-white/85 backdrop-blur-md sticky top-0 z-50 border-b border-black/5">
      {/* Brand wordmark */}
      <div 
        onClick={() => { onScreenChange('Landing'); setMobileMenuOpen(false); }} 
        className="flex items-center cursor-pointer"
      >
        <span className="text-black font-semibold tracking-[0.25em] text-sm uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>
          ATHER
        </span>
      </div>

      {/* Desktop Menu - Modern Minimalist */}
      <ul className="hidden lg:flex items-center space-x-8 text-[10px] font-bold tracking-widest uppercase">
        {navItems.map((item) => {
          const isActive = currentScreen === item.screen;
          return (
            <li 
              key={item.screen}
              onClick={() => onScreenChange(item.screen)}
              className={`flex items-center gap-1.5 cursor-pointer hover:opacity-100 transition-all duration-300 relative py-1 ${
                isActive ? 'text-black opacity-100 font-extrabold' : 'text-zinc-500 opacity-70 hover:text-black'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-black rounded-full" />
              )}
            </li>
          );
        })}
      </ul>

      {/* Action CTA */}
      <div className="hidden md:flex items-center gap-4">
        <button 
          onClick={() => onScreenChange('Dashboard')}
          className="inline-flex items-center gap-1 bg-black text-white hover:bg-zinc-800 text-[9px] font-bold tracking-widest uppercase py-2 px-4 rounded-full transition-all duration-300 cursor-pointer"
        >
          <span>UPLINK LIVE</span>
          <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>

      {/* Mobile Menu trigger */}
      <div className="flex lg:hidden items-center gap-3">
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 text-black hover:bg-zinc-100 rounded-sm"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-black/10 py-6 px-6 flex flex-col gap-4 shadow-xl z-50 lg:hidden">
          <span className="text-[9px] font-bold tracking-widest text-zinc-400 uppercase border-b border-black/5 pb-1">Suit Uplink Systems</span>
          {navItems.map((item) => {
            const isActive = currentScreen === item.screen;
            return (
              <button
                key={item.screen}
                onClick={() => {
                  onScreenChange(item.screen);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 text-left w-full py-2.5 px-3 rounded-md transition-colors text-xs font-mono tracking-wider ${
                  isActive ? 'bg-zinc-100 text-black font-bold' : 'text-zinc-600 hover:bg-zinc-50 hover:text-black'
                }`}
              >
                {item.icon}
                <span>{item.label.toUpperCase()}</span>
              </button>
            );
          })}
          <button
            onClick={() => {
              onScreenChange('Dashboard');
              setMobileMenuOpen(false);
            }}
            className="mt-2 w-full text-center bg-black hover:bg-zinc-800 text-white py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-colors"
          >
            ESTABLISH AX-09 CONSOLE
          </button>
        </div>
      )}
    </nav>
  );
}
