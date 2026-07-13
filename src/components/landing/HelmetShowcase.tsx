import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HELMETS = [
  {
    src: '/images/helmet-1.png',
    alt: 'ATHER S-9 helmet — three-quarter view with visor raised',
    label: 'S-9 DOME • VISOR OPEN',
    code: 'REF 10-128',
  },
  {
    src: '/images/helmet-2.png',
    alt: 'ATHER S-9 helmet — frontal view with sealed visor',
    label: 'S-9 DOME • FRONTAL SEAL',
    code: 'REF 10-129',
  },
];

/**
 * Helmet gallery — images switch with the left / right buttons (no parallax).
 */
export default function HelmetShowcase() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const go = (dir: number) => {
    setDirection(dir);
    setIndex((prev) => (prev + dir + HELMETS.length) % HELMETS.length);
  };

  const helmet = HELMETS[index];

  return (
    <section className="py-16 md:py-24 bg-zinc-50 border-b border-black/5 overflow-hidden" id="helmet">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <header className="text-center mb-8 md:mb-12">
          <span className="text-[9px] font-mono tracking-[0.25em] text-zinc-400 uppercase font-bold">HELMET SUB-SYSTEM</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-technical uppercase mt-2 text-black" style={{ fontFamily: 'Anton, sans-serif' }}>
            S-9 HELMET DOME
          </h2>
          <p className="text-zinc-500 text-[10px] sm:text-xs font-mono mt-2">Use the arrows to inspect each configuration</p>
        </header>

        <div className="relative flex items-center justify-center gap-2 sm:gap-6">
          {/* Left button */}
          <button
            onClick={() => go(-1)}
            aria-label="Previous helmet view"
            className="shrink-0 z-20 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black text-white hover:bg-zinc-800 transition-colors shadow-md cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Image frame */}
          <div className="relative w-full max-w-3xl aspect-[4/3] rounded-2xl overflow-hidden border border-black/10 bg-white shadow-sm">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.img
                key={helmet.src}
                src={helmet.src}
                alt={helmet.alt}
                custom={direction}
                initial={{ opacity: 0, x: direction * 80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -80 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* Technical labels */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 text-[8px] sm:text-[9px] font-mono text-zinc-600 bg-white/80 backdrop-blur-sm border border-black/10 px-2.5 py-1 rounded z-10">
              {helmet.label}
            </div>
            <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 text-[8px] sm:text-[9px] font-mono text-zinc-500 bg-white/80 backdrop-blur-sm border border-black/10 px-2.5 py-1 rounded z-10">
              {helmet.code}
            </div>
          </div>

          {/* Right button */}
          <button
            onClick={() => go(1)}
            aria-label="Next helmet view"
            className="shrink-0 z-20 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black text-white hover:bg-zinc-800 transition-colors shadow-md cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {HELMETS.map((h, i) => (
            <button
              key={h.src}
              onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
              aria-label={`Show helmet view ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-colors ${i === index ? 'bg-black' : 'bg-zinc-300 hover:bg-zinc-400'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
