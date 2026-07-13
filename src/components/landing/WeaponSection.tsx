import { motion } from 'motion/react';

/**
 * Sidearm section — the pistol render sits on a white section so its
 * white background disappears via mix-blend-multiply.
 */
export default function WeaponSection() {
  return (
    <section className="py-16 md:py-24 bg-white border-b border-black/5 overflow-hidden" id="sidearm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text column */}
          <div className="lg:col-span-4 order-2 lg:order-1">
            <span className="text-[9px] font-mono tracking-[0.25em] text-zinc-400 uppercase font-bold">FIELD EQUIPMENT</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-technical uppercase mt-2 mb-6 text-black" style={{ fontFamily: 'Anton, sans-serif' }}>
              DIRECT<br />ENERGY UNIT
            </h2>
            <p className="text-zinc-500 text-xs md:text-sm mb-8 leading-relaxed font-mono">
              Standard-issue EVA sidearm with a sealed plasma core, zero-recoil discharge, and vacuum-rated composite housing for orbital operations.
            </p>
            <div className="space-y-1.5 border-t border-black/10 pt-4 font-mono text-[9px] max-w-xs">
              <div className="flex justify-between text-zinc-400"><span>OUTPUT:</span><span className="text-black font-semibold">4.2 kJ / PULSE</span></div>
              <div className="flex justify-between text-zinc-400"><span>CORE TEMP:</span><span className="text-black font-semibold">STABLE</span></div>
              <div className="flex justify-between text-zinc-400"><span>MASS:</span><span className="text-black font-semibold">1.9 KG</span></div>
            </div>
          </div>

          {/* Pistol image — white bg removed via blend */}
          <div className="lg:col-span-8 order-1 lg:order-2 relative flex items-center justify-center">
            <motion.img
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              src="/images/pistol.png"
              alt="ATHER Direct Energy Unit sidearm with glowing blue plasma core"
              className="w-full max-w-2xl object-contain mix-blend-multiply"
            />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[8px] sm:text-[9px] font-mono text-zinc-400 tracking-widest uppercase whitespace-nowrap">
              MODULE AX-DEU • CAUTION: DIRECT ENERGY UNIT
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
