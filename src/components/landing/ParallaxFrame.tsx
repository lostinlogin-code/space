import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

/**
 * Sticky scroll section: the frame stays pinned while scrolling,
 * and the image inside cross-fades from the white-suit portrait
 * to the red deep-space scene.
 */
export default function ParallaxFrame() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // First image fades out, second fades in around the middle of the scroll range
  const firstOpacity = useTransform(scrollYProgress, [0.35, 0.6], [1, 0]);
  const secondOpacity = useTransform(scrollYProgress, [0.35, 0.6], [0, 1]);
  const firstScale = useTransform(scrollYProgress, [0, 0.6], [1, 1.08]);
  const secondScale = useTransform(scrollYProgress, [0.35, 1], [1.08, 1]);

  return (
    <section ref={containerRef} className="relative h-[260vh] bg-white border-y border-black/5" id="mission-frames">
      <div className="sticky top-16 h-[calc(100svh-64px)] flex flex-col items-center justify-center px-4 sm:px-6 md:px-12 py-6">
        <header className="text-center mb-4 md:mb-6">
          <span className="text-[9px] font-mono tracking-[0.25em] text-zinc-400 uppercase font-bold">MISSION ARCHIVE</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-technical uppercase mt-1 text-black" style={{ fontFamily: 'Anton, sans-serif' }}>
            FROM ORBIT TO INFERNO
          </h2>
          <p className="text-zinc-500 text-[10px] sm:text-xs font-mono mt-2">Keep scrolling — the frame transitions between mission environments</p>
        </header>

        {/* Pinned frame */}
        <div className="relative w-full max-w-4xl flex-1 min-h-0 rounded-2xl overflow-hidden border border-black/10 shadow-xl bg-zinc-950">
          <motion.img
            src="/images/suit-portrait.png"
            alt="ATHER suit portrait — pilot in pressurized helmet"
            style={{ opacity: firstOpacity, scale: firstScale }}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <motion.img
            src="/images/red-space.png"
            alt="Astronaut drifting through a red asteroid field near a molten planet"
            style={{ opacity: secondOpacity, scale: secondScale }}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Technical frame overlays */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 text-[8px] sm:text-[9px] font-mono text-white/70 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded z-10">
            REC • CAM-02 EXT FEED
          </div>
          <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 text-[8px] sm:text-[9px] font-mono text-white/70 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded z-10">
            SECTOR 真空領域 • LIVE
          </div>

          {/* Scroll progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-10">
            <motion.div style={{ scaleX: scrollYProgress }} className="h-full bg-white/70 origin-left" />
          </div>
        </div>
      </div>
    </section>
  );
}
