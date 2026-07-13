import { motion } from 'motion/react';
import { Screen } from '../../types';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onScreenChange: (screen: Screen) => void;
}

export default function Hero({ onScreenChange }: HeroProps) {
  return (
    <header className="relative h-[calc(100svh-64px)] min-h-[480px] w-full overflow-hidden flex flex-col justify-end">
      {/* Full-bleed hero image */}
      <img
        src="/images/hero-astronaut.png"
        alt="Astronaut in ATHER AX-09 EVA suit floating in deep space"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      {/* Readability gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 px-6 sm:px-10 md:px-20 pb-10 sm:pb-16 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="text-[10px] font-mono border border-white/25 rounded-full px-4 py-1.5 text-zinc-200 uppercase tracking-widest bg-white/10 backdrop-blur-sm">
            高機能軌道 • EVA SYSTEM
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-technical mb-6 text-white leading-none text-balance"
          style={{ fontFamily: 'Anton, sans-serif' }}
        >
          BUILT FOR<br />THE VOID
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-sm md:text-base text-zinc-300 mb-8 max-w-sm font-mono leading-relaxed"
        >
          Pressure-rated extravehicular activity (EVA) systems engineered for deep-space exploration and lunar surface operations.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={() => onScreenChange('Dashboard')}
            className="inline-flex items-center justify-between bg-white text-black hover:bg-zinc-200 px-8 py-4 rounded-full min-w-[240px] transition-all duration-300 group cursor-pointer"
          >
            <span className="text-xs font-bold tracking-widest uppercase font-sans">MEET THE AX-09</span>
            <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1.5 transition-transform" />
          </button>

          <button
            onClick={() => onScreenChange('HUDSimulator')}
            className="inline-flex items-center justify-center border border-white/30 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full min-w-[200px] transition-all duration-300 text-xs font-bold tracking-widest uppercase font-sans cursor-pointer backdrop-blur-sm"
          >
            SIMULATE HELMET HUD
          </button>
        </motion.div>
      </div>
    </header>
  );
}
