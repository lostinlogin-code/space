import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Screen } from '../types';
import { ArrowRight, ArrowUpRight, ShieldCheck, Activity, Eye, Compass, HelpCircle } from 'lucide-react';

interface LandingViewProps {
  onScreenChange: (screen: Screen) => void;
}

export default function LandingView({ onScreenChange }: LandingViewProps) {
  // Interactive HUD selector states
  const [activeSystem, setActiveSystem] = useState<'hud' | 'life' | null>('hud');

  // Pinned parallax: helmet 1 crossfades into helmet 2 while the section stays static
  const cockpitRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: cockpitProgress } = useScroll({
    target: cockpitRef,
    offset: ['start start', 'end end'],
  });
  const helmet1Opacity = useTransform(cockpitProgress, [0, 0.35, 0.55], [1, 1, 0]);
  const helmet1Scale = useTransform(cockpitProgress, [0, 0.55], [1, 0.8]);
  const helmet1Y = useTransform(cockpitProgress, [0, 0.55], [0, -60]);
  const helmet2Opacity = useTransform(cockpitProgress, [0.45, 0.7, 1], [0, 1, 1]);
  const helmet2Scale = useTransform(cockpitProgress, [0.45, 1], [1.2, 1]);
  const helmet2Y = useTransform(cockpitProgress, [0.45, 1], [80, 0]);
  
  // Terminal scrolling memory effect
  const [memoryLines, setMemoryLines] = useState([
    { addr: '0x00011f25', hex: 'b5 00', val: 'data=56', cmd: 'mov' },
    { addr: '0x00011f26', hex: 'e4 00', val: 'data=58', cmd: 'call' },
    { addr: '0x00011f27', hex: 'a0 01', val: 'data=60', cmd: 'add' },
    { addr: '0x00011f28', hex: 'f2 a1', val: 'data=12', cmd: 'jmp' },
    { addr: '0x00011f29', hex: '8c 02', val: 'data=99', cmd: 'cmp' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMemoryLines((prev) => {
        const nextAddr = '0x00011f' + Math.floor(Math.random() * 80 + 30).toString(16);
        const hexes = ['a1', 'b4', 'c3', 'd2', 'e5', 'ff', '00', '8c', 'f2'];
        const cmds = ['mov', 'add', 'call', 'cmp', 'jmp', 'push', 'pop', 'sub'];
        const randomHex = hexes[Math.floor(Math.random() * hexes.length)] + ' ' + Math.floor(Math.random() * 9).toString();
        const randomVal = 'data=' + Math.floor(Math.random() * 128);
        const randomCmd = cmds[Math.floor(Math.random() * cmds.length)];
        
        return [...prev.slice(1), { addr: nextAddr, hex: randomHex, val: randomVal, cmd: randomCmd }];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-technical-lines relative select-none">
      
      {/* SECTION 1: Hero Section */}
      <header className="relative min-h-[85vh] flex flex-col justify-center overflow-hidden px-8 md:px-20 py-20">
        
        {/* Large Vertical Background Kanji - Match mockup perfectly */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-full flex items-center justify-end pointer-events-none select-none w-1/3 z-0">
          <div className="grid grid-cols-2 text-[22vw] leading-[0.8] font-black opacity-15 gap-y-4 gap-x-2 text-black select-none font-technical">
            <div className="flex items-center justify-center">真</div>
            <div className="flex items-center justify-center">空</div>
            <div className="flex items-center justify-center">領</div>
            <div className="flex items-center justify-center">域</div>
          </div>
        </div>

        {/* Hero Astronaut Portrait - full page width, as in the reference video */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="hidden md:block absolute inset-0 pointer-events-none z-[5]"
          aria-hidden="true"
        >
          <img
            src="/images/astronaut-hero-cut.png"
            alt=""
            className="absolute left-1/2 -translate-x-[45%] bottom-0 h-[95%] w-auto max-w-none object-contain drop-shadow-2xl"
          />
        </motion.div>

        {/* Decorative Grid Lines to match technical blueprint style */}
        <div className="absolute inset-0 border-x border-black/5 pointer-events-none max-w-7xl mx-auto z-0" />
        <div className="absolute top-[20%] left-0 right-0 h-[1px] bg-black/5 pointer-events-none" />
        <div className="absolute bottom-[20%] left-0 right-0 h-[1px] bg-black/5 pointer-events-none" />

        {/* Content Column */}
        <div className="relative z-10 max-w-2xl text-left">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <span className="text-[10px] font-mono border border-black/15 rounded-full px-4 py-1.5 text-zinc-600 uppercase tracking-widest bg-white/50 backdrop-blur-sm">
              高機能軌道 • EVA SYSTEM
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-7xl sm:text-8xl md:text-9xl font-technical mb-8 text-black leading-none"
            id="main-headline"
            style={{ fontFamily: 'Anton, sans-serif' }}
          >
            BUILT FOR<br />THE VOID
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-sm md:text-base text-zinc-500 mb-12 max-w-sm font-mono leading-relaxed"
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
              className="inline-flex items-center justify-between bg-black text-white hover:bg-zinc-800 px-8 py-4 rounded-full min-w-[240px] transition-all duration-300 group cursor-pointer"
            >
              <span className="text-xs font-bold tracking-widest uppercase font-sans">MEET THE AX-09</span>
              <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1.5 transition-transform" />
            </button>

            <button 
              onClick={() => onScreenChange('HUDSimulator')}
              className="inline-flex items-center justify-center border border-black/15 bg-white/60 hover:bg-zinc-50 text-black px-8 py-4 rounded-full min-w-[200px] transition-all duration-300 text-xs font-bold tracking-widest uppercase font-sans cursor-pointer"
            >
              SIMULATE HELMET HUD
            </button>
          </motion.div>
        </div>
      </header>

      {/* SECTION 2: Space Suits Section */}
      <section className="py-24 px-6 md:px-12 bg-white border-y border-black/5" id="suits">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-technical text-black mb-4 uppercase" style={{ fontFamily: 'Anton, sans-serif' }}>
              NEXT-GEN SPACE SUITS
            </h2>
            <p className="text-zinc-500 font-mono text-xs md:text-sm max-w-md mx-auto leading-relaxed">
              Pressure-rated EVA life-support garments designed to sustain human operations in extreme thermal fluctuations and zero-gravity environments.
            </p>
          </header>

          {/* Interactive Technical Terminal Card */}
          <div className="relative bg-zinc-950 rounded-2xl p-6 md:p-12 mb-16 flex flex-col justify-between overflow-hidden shadow-xl min-h-[560px]">
            {/* Full-bleed background image replacing the black background */}
            <img
              src="/images/astronaut-standing.jpg"
              alt="Astronaut in an AX-09 EVA suit standing in deep space with a planet and asteroid behind"
              className="absolute inset-0 w-full h-full object-cover object-[50%_20%] pointer-events-none"
            />
            {/* Darkening gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 pointer-events-none" />
            
            <div className="flex justify-between items-start z-10">
              <div className="text-lg md:text-xl font-technical leading-none text-zinc-400 font-mono" style={{ fontFamily: 'Anton, sans-serif' }}>
                真空<br />領域
              </div>
              
              <div className="border border-zinc-800 p-3 text-[9px] text-zinc-500 font-mono bg-zinc-900/50">
                <div>REF: 10-128 LOT: 401224</div>
                <div className="mt-1">SYS STABLE • ORBITAL APOGEE</div>
                <div className="text-zinc-400 mt-1">DATE: 2026-07-12</div>
              </div>
            </div>

            {/* HUD overlay on top of the astronaut background */}
            <div className="my-8 flex justify-center items-center h-64 md:h-80 relative pointer-events-none z-10">
              <div className="absolute border border-dashed border-white/20 rounded-full w-64 h-64 md:w-80 md:h-80 animate-spin" style={{ animationDuration: '40s' }} />
              <div className="absolute border border-white/15 rounded-full w-48 h-48 md:w-60 md:h-60" />
              
              {/* Monospaced Blueprint labels */}
              <div className="absolute left-0 md:left-8 top-4 text-[9px] font-mono text-zinc-300 border-b border-white/20 pb-0.5">
                [HELMET DOME] OVERLAY S-9
              </div>
              <div className="absolute right-0 md:right-8 top-1/2 text-[9px] font-mono text-zinc-300 border-b border-white/20 pb-0.5">
                [EXO-STRUCTURE] TITANIUM GR-5
              </div>
              <div className="absolute bottom-2 left-4 md:left-16 text-[9px] font-mono text-zinc-300">
                [PRIMARY LIFE SUPPORT] O2 CYCLE 100%
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-end gap-6 z-10 border-t border-zinc-900 pt-6">
              <button 
                onClick={() => onScreenChange('Dashboard')}
                className="inline-flex items-center gap-3 bg-white text-black px-6 py-3 rounded-full hover:bg-zinc-200 transition-colors group cursor-pointer"
              >
                <span className="font-technical text-sm tracking-wider" style={{ fontFamily: 'Anton, sans-serif' }}>Access AX-09 Uplink</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              {/* Memory readouts scrolling */}
              <div className="font-mono text-[9px] text-zinc-500 text-left md:text-right leading-relaxed max-w-xs">
                <div className="mb-1 text-zinc-400 font-bold uppercase tracking-wider">LIVE TELEMETRY LOG</div>
                <div className="space-y-0.5 bg-zinc-900/30 p-2.5 rounded-md border border-zinc-900">
                  {memoryLines.map((line, idx) => (
                    <div key={idx} className="flex gap-4">
                      <span className="text-zinc-600">{line.addr}</span>
                      <span className="text-zinc-500 font-semibold">{line.hex}</span>
                      <span className="text-zinc-400">{line.val}</span>
                      <span className="text-zinc-300">{line.cmd}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { val: '200+', lab: 'Missions Supported' },
              { val: '100%', lab: 'Pressure Integrity' },
              { val: '0.01%', lab: 'Failure Rate' },
              { val: '∞', lab: 'Possibilities' },
            ].map((metric, i) => (
              <div key={i} className="flex flex-col items-center bg-zinc-50/50 p-6 rounded-xl border border-black/5 hover:border-black/10 transition-colors">
                <span className="text-[9px] font-mono border border-black/10 rounded-full px-3 py-1 text-zinc-400 mb-4 font-bold uppercase tracking-widest bg-white">
                  永远轨道
                </span>
                <div className="text-4xl md:text-5xl font-technical mb-2 text-black" style={{ fontFamily: 'Anton, sans-serif' }}>
                  {metric.val}
                </div>
                <div className="text-[9px] text-zinc-400 font-mono uppercase tracking-widest">
                  {metric.lab}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: Interactive System HUD & Life Support Integration */}
      <section className="py-24 bg-zinc-50 border-b border-black/5">
        <div className="max-w-6xl mx-auto px-6">
          <header className="text-center mb-12">
            <span className="text-[9px] font-mono tracking-[0.25em] text-zinc-400 uppercase font-bold">INTEGRATED SUB-SYSTEMS</span>
            <h2 className="text-4xl md:text-5xl font-technical uppercase mt-2" style={{ fontFamily: 'Anton, sans-serif' }}>
              ORBITAL COCKPIT SYSTEMS
            </h2>
            <p className="text-zinc-500 text-xs font-mono mt-2">Click highlighted areas below to query sub-system specifications</p>
          </header>

          {/* Tall scroll track: the inner card is sticky, so the page appears static while helmets swap */}
          <div ref={cockpitRef} className="relative h-[240vh]">
          <div className="sticky top-[8vh] w-full h-[84vh] flex items-center justify-center border border-black/5 rounded-2xl bg-white overflow-hidden shadow-sm">
            
            {/* Concentric Dashed Circles */}
            <div className="absolute border border-dashed border-zinc-200 rounded-full w-[460px] h-[460px] animate-spin" style={{ animationDuration: '60s' }} />
            <div className="absolute border border-dashed border-zinc-300 rounded-full w-[340px] h-[340px]" />
            <div className="absolute border border-zinc-200 rounded-full w-[220px] h-[220px]" />

            {/* Helmet 1: side view - fades out on scroll */}
            <motion.img
              src="/images/helmet-side-cut.png"
              alt="AX-09 EVA helmet, side view with open visor"
              style={{ opacity: helmet1Opacity, scale: helmet1Scale, y: helmet1Y }}
              className="absolute z-10 h-[320px] md:h-[420px] w-auto object-contain pointer-events-none drop-shadow-[0_30px_50px_rgba(0,0,0,0.25)]"
            />

            {/* Helmet 2: front view - fades in on scroll */}
            <motion.img
              src="/images/helmet-front-cut.png"
              alt="AX-09 EVA helmet, front view with transparent dome"
              style={{ opacity: helmet2Opacity, scale: helmet2Scale, y: helmet2Y }}
              className="absolute z-10 h-[320px] md:h-[420px] w-auto object-contain pointer-events-none drop-shadow-[0_30px_50px_rgba(0,0,0,0.25)]"
            />
            
            {/* Clickable Sensor Dot Left - HUD System */}
            <button 
              onClick={() => setActiveSystem('hud')}
              className="absolute left-[20%] md:left-[28%] top-[35%] z-30 group"
              aria-label="Select HUD systems"
            >
              <span className="absolute inline-flex h-6 w-6 rounded-full bg-black/20 animate-ping" />
              <span className="relative flex rounded-full h-4 w-4 bg-black border-2 border-white items-center justify-center shadow-md">
                <span className={`w-1.5 h-1.5 rounded-full ${activeSystem === 'hud' ? 'bg-emerald-400' : 'bg-white'}`} />
              </span>
              <span className="absolute left-6 -top-2 bg-black text-white text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                HUD SENSORS
              </span>
            </button>

            {/* Clickable Sensor Dot Right - Life Systems */}
            <button 
              onClick={() => setActiveSystem('life')}
              className="absolute right-[20%] md:right-[28%] bottom-[35%] z-30 group"
              aria-label="Select Life Support systems"
            >
              <span className="absolute inline-flex h-6 w-6 rounded-full bg-zinc-500/20 animate-ping" style={{ animationDelay: '1s' }} />
              <span className="relative flex rounded-full h-4 w-4 bg-zinc-600 border-2 border-white items-center justify-center shadow-md">
                <span className={`w-1.5 h-1.5 rounded-full ${activeSystem === 'life' ? 'bg-emerald-400' : 'bg-white'}`} />
              </span>
              <span className="absolute right-6 -top-2 bg-zinc-800 text-white text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                LIFE SYS SENSORS
              </span>
            </button>

            {/* Advanced HUD System Card - Positioned in layout to the left */}
            <div className={`absolute left-4 md:left-12 top-6 md:top-12 w-64 md:w-72 bg-white/95 backdrop-blur-sm p-5 border rounded-lg transition-all duration-500 ${
              activeSystem === 'hud' ? 'border-black/20 translate-y-0 opacity-100 shadow-md scale-100' : 'border-black/5 translate-y-4 opacity-40 scale-95 pointer-events-none'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-4 h-4 text-black" />
                <span className="text-[9px] font-mono font-bold text-zinc-400 tracking-widest uppercase">OCULAR INTERFACE</span>
              </div>
              <h3 className="font-technical text-3xl mb-3 text-black" style={{ fontFamily: 'Anton, sans-serif' }}>
                ADVANCED HUD
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed font-mono mb-4">
                Integrated real-time ocular display projecting retinal vitals, targeting locks, magnetic orientations, and environmental threat analysis.
              </p>
              <div className="space-y-1.5 border-t pt-3 font-mono text-[9px]">
                <div className="flex justify-between text-zinc-400"><span>OCULAR RESP:</span><span className="text-black font-semibold">120 Hz</span></div>
                <div className="flex justify-between text-zinc-400"><span>THREAT SCAN:</span><span className="text-black font-semibold">ACTIVE</span></div>
                <div className="flex justify-between text-zinc-400"><span>MAGNETO CLASSIF:</span><span className="text-black font-semibold">SECURE</span></div>
              </div>
            </div>

            {/* Life Systems Card - Positioned in layout to the right */}
            <div className={`absolute right-4 md:right-12 bottom-6 md:bottom-12 w-64 md:w-72 bg-white/95 backdrop-blur-sm p-5 border rounded-lg transition-all duration-500 ${
              activeSystem === 'life' ? 'border-zinc-800 translate-y-0 opacity-100 shadow-md scale-100' : 'border-zinc-200 translate-y-4 opacity-40 scale-95 pointer-events-none'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-zinc-600" />
                <span className="text-[9px] font-mono font-bold text-zinc-400 tracking-widest uppercase">ECOLOGICAL SEAL</span>
              </div>
              <h3 className="font-technical text-3xl mb-3 text-black" style={{ fontFamily: 'Anton, sans-serif' }}>
                LIFE SYSTEMS
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed font-mono mb-4">
                Autonomous closed-loop oxygen recyclers, thermal heating/cooling manifolds, haptic feedback layer, and high-capacity carbon filtration.
              </p>
              <div className="space-y-1.5 border-t pt-3 font-mono text-[9px]">
                <div className="flex justify-between text-zinc-400"><span>O2 AUTONOMY:</span><span className="text-black font-semibold">8.5 Hrs</span></div>
                <div className="flex justify-between text-zinc-400"><span>THERMO MANIFOLD:</span><span className="text-black font-semibold">36.6 °C nominal</span></div>
                <div className="flex justify-between text-zinc-400"><span>FILTRATION LVL:</span><span className="text-black font-semibold">99.98% HEPA</span></div>
              </div>
            </div>

            {/* Mobile selection tabs helper for small screens */}
            <div className="absolute bottom-4 flex gap-2 md:hidden z-30">
              <button 
                onClick={() => setActiveSystem('hud')}
                className={`px-3 py-1.5 text-[9px] font-mono tracking-widest uppercase border rounded-full ${
                  activeSystem === 'hud' ? 'bg-black text-white border-black' : 'bg-white text-zinc-500'
                }`}
              >
                HUD
              </button>
              <button 
                onClick={() => setActiveSystem('life')}
                className={`px-3 py-1.5 text-[9px] font-mono tracking-widest uppercase border rounded-full ${
                  activeSystem === 'life' ? 'bg-black text-white border-black' : 'bg-white text-zinc-500'
                }`}
              >
                LIFE SUPPORT
              </button>
            </div>
          </div>
          </div>
        </div>

        {/* Engineered Technology Grid - Matches bottom grid from Screen 13 */}
        <div className="py-24 px-6 md:px-12 max-w-[1440px] mx-auto border-t border-black/5" id="engineered-technology">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Text Column */}
            <div className="lg:col-span-4 flex flex-col justify-center h-full">
              <h2 className="font-technical text-5xl md:text-6xl mb-6 text-black" style={{ fontFamily: 'Anton, sans-serif' }}>
                ENGINEERED<br />TECHNOLOGY
              </h2>
              <p className="text-zinc-500 text-xs md:text-sm max-w-sm mb-10 leading-relaxed font-mono">
                Pushing the physical limits of human physiology in lethal atmospheric pressures through micro-welded titanium armor and orbital-grade joint articulation.
              </p>
              <div>
                <button 
                  onClick={() => onScreenChange('Dashboard')}
                  className="inline-flex items-center gap-3 font-mono text-[10px] font-bold tracking-[0.2em] text-black border-b-2 border-black pb-1 hover:opacity-70 transition-opacity uppercase cursor-pointer"
                >
                  EXPLORE MODULES
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Cards Column */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:col-span-8">
              {/* Card 1: Mobility */}
              <div 
                onClick={() => onScreenChange('Dashboard')}
                className="relative bg-white border border-black/5 rounded-lg p-8 flex flex-col justify-end h-[420px] shadow-sm hover:border-black/20 hover:shadow-md transition-all duration-300 cursor-pointer group overflow-hidden"
              >
                <div className="mb-auto text-zinc-300 group-hover:text-black transition-colors relative z-10">
                  <Compass className="w-10 h-10 stroke-1" />
                </div>
                <img
                  src="/images/cyber-arm-cut.png"
                  alt="Robotic cyber arm with articulated fingers and data port"
                  className="absolute right-[-15%] top-[12%] w-[115%] max-w-none object-contain transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                />
                <div className="relative z-10">
                  <span className="text-[8px] font-mono text-zinc-400 tracking-widest uppercase block mb-1">MODULE AX-01</span>
                  <h3 className="font-technical text-4xl mb-3 text-black group-hover:tracking-wider transition-all duration-300" style={{ fontFamily: 'Anton, sans-serif' }}>
                    MOBILITY
                  </h3>
                  <p className="text-zinc-500 text-[10px] font-mono font-bold uppercase tracking-[0.2em]">
                    Advanced material design for dexterity and tactile feedback.
                  </p>
                </div>
              </div>

              {/* Card 2: EVA Systems */}
              <div 
                onClick={() => onScreenChange('Dashboard')}
                className="relative bg-white border border-black/5 rounded-lg p-8 flex flex-col justify-end h-[420px] shadow-sm hover:border-black/20 hover:shadow-md transition-all duration-300 cursor-pointer group overflow-hidden"
              >
                <div className="mb-auto text-zinc-300 group-hover:text-black transition-colors relative z-10">
                  <ShieldCheck className="w-10 h-10 stroke-1" />
                </div>
                <img
                  src="/images/pistol-cut.png"
                  alt="Futuristic sidearm with exposed blue energy coils"
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[62%] w-auto object-contain transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                />
                <div className="relative z-10">
                  <span className="text-[8px] font-mono text-zinc-400 tracking-widest uppercase block mb-1">MODULE AX-02</span>
                  <h3 className="font-technical text-4xl mb-3 text-black group-hover:tracking-wider transition-all duration-300" style={{ fontFamily: 'Anton, sans-serif' }}>
                    EVA SYSTEMS
                  </h3>
                  <p className="text-zinc-500 text-[10px] font-mono font-bold uppercase tracking-[0.2em]">
                    Double-sealed hyper-pressure pressure shells and composite plates.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 4: Final Space Section */}
      <section className="relative h-screen overflow-hidden bg-black" aria-label="Deep space mission">
        {/* Static background image */}
        <img
          src="/images/space-final.png"
          alt="Astronaut in an AX-09 EVA suit floating above Earth with the Moon in the distance"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Subtle darkening for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

        {/* Overlay content */}
        <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-20 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="max-w-2xl"
          >
            <span className="text-[10px] font-mono border border-white/25 rounded-full px-4 py-1.5 text-zinc-300 uppercase tracking-widest bg-white/5 backdrop-blur-sm">
              深宇宙 • DEEP SPACE READY
            </span>

            <h2
              className="text-6xl sm:text-7xl md:text-8xl font-technical text-white leading-none mt-8 mb-6 text-balance"
              style={{ fontFamily: 'Anton, sans-serif' }}
            >
              THE VOID IS<br />CALLING
            </h2>

            <p className="text-sm md:text-base text-zinc-300 max-w-sm font-mono leading-relaxed mb-10">
              Beyond the last tether, there is only you and the AX-09. Every seam, every seal, every system — built so humanity can answer.
            </p>

            <button
              onClick={() => onScreenChange('Dashboard')}
              className="inline-flex items-center justify-between bg-white text-black hover:bg-zinc-200 px-8 py-4 rounded-full min-w-[240px] transition-all duration-300 group cursor-pointer"
            >
              <span className="text-xs font-bold tracking-widest uppercase font-sans">BEGIN THE MISSION</span>
              <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1.5 transition-transform" />
            </button>
          </motion.div>

          {/* Bottom telemetry line */}
          <div className="absolute bottom-8 left-8 md:left-20 right-8 md:right-20 flex justify-between items-end text-[9px] font-mono text-zinc-400 uppercase tracking-widest border-t border-white/10 pt-4">
            <span>ALT: 408 KM • LEO</span>
            <span className="hidden md:inline">O2: 98% • SUIT PRESSURE NOMINAL</span>
            <span>永遠軌道 // AX-09</span>
          </div>
        </div>
      </section>

    </div>
  );
}
