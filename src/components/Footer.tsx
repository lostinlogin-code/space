import { Screen } from '../types';

interface FooterProps {
  onScreenChange: (screen: Screen) => void;
}

export default function Footer({ onScreenChange }: FooterProps) {
  return (
    <footer className="py-12 px-8 border-t border-black/5 bg-white">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-4">
          <div 
            onClick={() => onScreenChange('Landing')}
            className="w-6 h-6 bg-black rounded-sm flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
          >
            <span className="text-white font-technical text-sm leading-none">A</span>
          </div>
          <div className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase font-mono">
            © 2026 ATHER SYSTEM ARCHITECTURE • ORBITAL GRADE
          </div>
        </div>
        <div className="flex gap-8 text-[10px] font-bold tracking-widest uppercase font-mono">
          <a href="#" className="text-zinc-500 hover:text-black transition-colors">Privacy</a>
          <a href="#" className="text-zinc-500 hover:text-black transition-colors">Terms</a>
          <a href="#" className="text-zinc-500 hover:text-black transition-colors">Telemetry Status</a>
        </div>
      </div>
    </footer>
  );
}
