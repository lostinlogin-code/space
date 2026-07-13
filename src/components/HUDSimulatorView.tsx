import React, { useState, useEffect, useRef } from 'react';
import { Screen } from '../types';
import { Eye, Shield, AlertOctagon, Camera, VideoOff, Crosshair, Compass, Zap, HelpCircle } from 'lucide-react';

interface HUDSimulatorProps {
  onScreenChange: (screen: Screen) => void;
}

export default function HUDSimulatorView({ onScreenChange }: HUDSimulatorProps) {
  // Filters state
  const [nightVision, setNightVision] = useState(false);
  const [thermalFilter, setThermalFilter] = useState(false);
  const [targetLock, setTargetLock] = useState<'ISS_DOCKING_A' | 'LUNAR_GATEWAY' | 'LANDER_01'>('ISS_DOCKING_A');
  const [alarmActive, setAlarmActive] = useState(false);

  // Webcam stream state
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Fallback starfield backdrop state (canvas based)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Interactive mouse offsets for HUD attitude ladder & targeting
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [smoothedMouse, setSmoothedMouse] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Initialize Webcam Stream
  const startWebcam = async () => {
    setCameraError(false);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: 'user' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err) {
      console.warn("Webcam access declined or unavailable:", err);
      setCameraActive(false);
      setCameraError(true);
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Start webcam on load, stop on unload
  useEffect(() => {
    startWebcam();
    return () => stopWebcam();
  }, []);

  // Track cursor position inside HUD container for targeting & pitch simulation
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    // Normalize coordinates around center (0,0) from -1 to 1
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setMousePos({ x, y });
  };

  // Smooth mouse movement for trailing lock-on effect
  useEffect(() => {
    let animationId: number;
    const smooth = () => {
      setSmoothedMouse(prev => ({
        x: prev.x + (mousePos.x - prev.x) * 0.12,
        y: prev.y + (mousePos.y - prev.y) * 0.12,
      }));
      animationId = requestAnimationFrame(smooth);
    };
    smooth();
    return () => cancelAnimationFrame(animationId);
  }, [mousePos]);

  // Starfield Simulation Canvas (drawn as fallback or background overlay)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const stars: { x: number; y: number; z: number; speed: number; size: number }[] = [];
    
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = canvas.parentElement?.clientHeight || 500;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Seed stars
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * canvas.width - canvas.width / 2,
        y: Math.random() * canvas.height - canvas.height / 2,
        z: Math.random() * canvas.width,
        speed: Math.random() * 2 + 1,
        size: Math.random() * 1.5 + 0.5
      });
    }

    const drawStars = () => {
      // Background base
      if (cameraActive) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // transparent overlay over video
      } else {
        ctx.fillStyle = '#09090b'; // dark void backdrop
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.fillStyle = nightVision ? '#10b981' : '#ffffff';

      // Move & draw stars radiating outwards
      for (const star of stars) {
        star.z -= star.speed;
        if (star.z <= 0) {
          star.z = canvas.width;
          star.x = Math.random() * canvas.width - canvas.width / 2;
          star.y = Math.random() * canvas.height - canvas.height / 2;
        }

        const k = 128.0 / star.z;
        const px = star.x * k + canvas.width / 2;
        const py = star.y * k + canvas.height / 2;

        if (px >= 0 && px < canvas.width && py >= 0 && py < canvas.height) {
          const size = star.size * k * 0.5;
          ctx.beginPath();
          ctx.arc(px, py, Math.max(0.5, Math.min(3, size)), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw faint orbital lines overlay
      ctx.strokeStyle = nightVision ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, canvas.height * 0.4, 0, Math.PI * 2);
      ctx.stroke();

      animId = requestAnimationFrame(drawStars);
    };

    drawStars();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animId);
    };
  }, [cameraActive, nightVision]);

  return (
    <div className="min-h-screen bg-zinc-50 p-6 md:p-12 select-none">
      <div className="max-w-7xl mx-auto">
        
        {/* HUD View Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-black/10 pb-6 mb-8">
          <div>
            <span className="text-[10px] font-mono border border-black/15 rounded-full px-3 py-1 text-zinc-500 uppercase tracking-widest bg-white">
              SENSORS: PILOT OCULAR OVERLAY ACTIVE
            </span>
            <h1 className="text-4xl md:text-5xl font-technical uppercase mt-3" style={{ fontFamily: 'Anton, sans-serif' }}>
              ADVANCED HELMET HUD SIMULATOR
            </h1>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => onScreenChange('Dashboard')}
              className="bg-black hover:bg-zinc-800 text-white text-[10px] font-bold tracking-widest uppercase px-5 py-3 rounded-full transition-all cursor-pointer"
            >
              CONSOLE MONITOR
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: HUD FEED BOX (9 COLS) */}
          <div className="lg:col-span-9 space-y-6">
            
            <div 
              ref={containerRef}
              onMouseMove={handleMouseMove}
              className={`relative h-[600px] w-full rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-2xl transition-all duration-300 ${
                nightVision ? 'scanlines border-emerald-500/40 ring-1 ring-emerald-500/25' : ''
              } ${
                alarmActive ? 'animate-pulse ring-2 ring-red-500 border-red-500' : ''
              }`}
            >
              
              {/* WEBCAM CAMERA CONTAINER */}
              {cameraActive && (
                <video 
                  ref={videoRef}
                  referrerPolicy="no-referrer"
                  className={`absolute inset-0 w-full h-full object-cover pointer-events-none transform -scale-x-100 z-0 transition-all duration-300 ${
                    nightVision ? 'brightness-125 contrast-150 saturate-0 hue-rotate-90' : ''
                  } ${
                    thermalFilter ? 'invert brightness-110 saturate-200 hue-rotate-180 contrast-125' : ''
                  }`}
                  muted
                  playsInline
                />
              )}

              {/* STARFIELD / THERMAL SIMULATION FALLBACK OVERLAY */}
              <canvas 
                ref={canvasRef} 
                className={`absolute inset-0 w-full h-full object-cover z-10 pointer-events-none ${
                  thermalFilter && !cameraActive ? 'bg-gradient-to-tr from-blue-900 via-orange-800 to-yellow-600' : ''
                }`}
              />

              {/* NIGHT VISION CRT NOISE OVERLAY FILTER */}
              {nightVision && (
                <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none z-20" />
              )}

              {/* THERMAL HUD CHROME CHROMATIC NOISE FILTER */}
              {thermalFilter && (
                <div className="absolute inset-0 bg-orange-500/5 mix-blend-color pointer-events-none z-20" />
              )}

              {/* RED ALARM SIGNAL OVERLAY */}
              {alarmActive && (
                <div className="absolute inset-0 bg-red-600/15 pointer-events-none z-20 animate-pulse border-8 border-red-600/30" />
              )}

              {/* HUD OVERLAY VECTORS (GLOWING SENSOR TEXTS) */}
              <div className={`absolute inset-0 z-30 font-mono text-[9px] pointer-events-none flex flex-col justify-between p-6 ${
                nightVision ? 'text-emerald-400' : thermalFilter ? 'text-orange-400 font-extrabold' : alarmActive ? 'text-red-500' : 'text-white'
              }`}>
                
                {/* HUD TOP ROW: Active Targets & Pitch status */}
                <div className="flex justify-between items-start bg-gradient-to-b from-black/50 to-transparent p-4 rounded-t-xl">
                  <div>
                    <div className="text-xs font-bold flex items-center gap-1.5 uppercase">
                      <Zap className="w-3.5 h-3.5 animate-pulse" />
                      <span>HUD SYSTEM: APOGEE ALIGNED</span>
                    </div>
                    <div className="mt-1 font-mono text-[8px] opacity-70">
                      SYS CODE: AX09-PILOT-82B • RANGE_LOCK_CONFIRMED
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-zinc-400">ACTIVE TARGET LOCK-ON:</div>
                    <div className={`text-xs font-bold tracking-widest ${alarmActive ? 'text-red-500' : 'text-emerald-400 font-bold'}`}>
                      {targetLock === 'ISS_DOCKING_A' && 'ISS DOCKING PORT A'}
                      {targetLock === 'LUNAR_GATEWAY' && 'LUNAR GATEWAY CORE'}
                      {targetLock === 'LANDER_01' && 'APOLLO XI CRATER DEBRIS'}
                    </div>
                    <div className="opacity-60 text-[8px]">OFFSET: {smoothedMouse.x.toFixed(3)}, {smoothedMouse.y.toFixed(3)}</div>
                  </div>
                </div>

                {/* HUD CENTER: Dynamic Pitch Ladder & Attitude Lines */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[340px] h-[240px] flex items-center justify-center pointer-events-none">
                  
                  {/* Outer Crosshair Ring */}
                  <div className={`border-2 border-dashed rounded-full w-48 h-48 flex items-center justify-center animate-spin duration-1000 ${
                    nightVision ? 'border-emerald-500/20' : thermalFilter ? 'border-orange-500/20' : alarmActive ? 'border-red-500/20' : 'border-white/10'
                  }`} style={{ animationDuration: '30s' }} />

                  {/* Inner Targeting Reticle */}
                  <div className={`absolute border rounded-full w-28 h-28 flex items-center justify-center ${
                    nightVision ? 'border-emerald-500/40' : thermalFilter ? 'border-orange-500/40' : alarmActive ? 'border-red-500/30' : 'border-white/20'
                  }`}>
                    {/* Compass ticks */}
                    <div className="absolute top-1 w-1 h-2 bg-current" />
                    <div className="absolute bottom-1 w-1 h-2 bg-current" />
                    <div className="absolute left-1 h-1 w-2 bg-current" />
                    <div className="absolute right-1 h-1 w-2 bg-current" />
                  </div>

                  {/* Attitude Pitch Ladder (Rotates and shifts on mouse offset) */}
                  <div 
                    className="absolute w-56 flex flex-col justify-between h-36 transition-transform"
                    style={{
                      transform: `translate3d(${-smoothedMouse.x * 20}px, ${-smoothedMouse.y * 30}px, 0) rotate(${-smoothedMouse.x * 12}deg)`
                    }}
                  >
                    {/* Up Ladder */}
                    <div className="flex justify-between items-center px-4">
                      <span className="opacity-60">+15°</span>
                      <div className="w-16 h-[2px] bg-current relative">
                        <div className="absolute right-0 bottom-0 h-2 w-[2px] bg-current" />
                      </div>
                      <div className="w-16 h-[2px] bg-current relative">
                        <div className="absolute left-0 bottom-0 h-2 w-[2px] bg-current" />
                      </div>
                      <span className="opacity-60">+15°</span>
                    </div>

                    {/* Zero horizon ladder */}
                    <div className="flex justify-between items-center">
                      <span>00°</span>
                      <div className="w-20 h-[1.5px] bg-current border-b border-dashed border-current" />
                      <div className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">
                        <div className="w-1 h-1 bg-current rounded-full" />
                      </div>
                      <div className="w-20 h-[1.5px] bg-current border-b border-dashed border-current" />
                      <span>00°</span>
                    </div>

                    {/* Down Ladder */}
                    <div className="flex justify-between items-center px-4">
                      <span className="opacity-60">-15°</span>
                      <div className="w-16 h-[2px] bg-current relative">
                        <div className="absolute right-0 top-0 h-2 w-[2px] bg-current" />
                      </div>
                      <div className="w-16 h-[2px] bg-current relative">
                        <div className="absolute left-0 top-0 h-2 w-[2px] bg-current" />
                      </div>
                      <span className="opacity-60">-15°</span>
                    </div>
                  </div>

                  {/* Lock-On trailing reticle (follows mouse exactly with delay) */}
                  <div 
                    className="absolute w-12 h-12 border-2 border-red-500 rounded flex items-center justify-center pointer-events-none"
                    style={{
                      transform: `translate3d(${smoothedMouse.x * 250}px, ${smoothedMouse.y * 220}px, 0)`,
                      borderColor: nightVision ? '#34d399' : thermalFilter ? '#f97316' : alarmActive ? '#ef4444' : '#ffffff'
                    }}
                  >
                    <Crosshair className="w-5 h-5 opacity-70 animate-ping text-current" />
                    <span className="absolute -top-5 left-0 whitespace-nowrap bg-black/60 px-1.5 py-0.5 rounded text-[7px] text-white">
                      LOCK AT ACQ: {((1.0 - Math.abs(smoothedMouse.x)) * 100).toFixed(0)}%
                    </span>
                  </div>

                </div>

                {/* HUD LEFT: VELOCITY GAUGES (SPEED TAPE) */}
                <div className="absolute left-6 top-1/4 h-1/2 w-14 flex flex-col justify-between border-r border-current/25 pr-3 py-6">
                  <div className="text-[8px] opacity-40">VELOCITY</div>
                  <div className="font-bold border-b border-current py-1">2.41 km/s</div>
                  <div className="opacity-60">2.39</div>
                  <div className="opacity-60 font-bold bg-current/20 px-1 text-center py-0.5 rounded">2.38</div>
                  <div className="opacity-60">2.37</div>
                  <div className="text-[7px] text-zinc-500 font-mono">DELTA-V L2</div>
                </div>

                {/* HUD RIGHT: ALTIMETER GAUGES (ALTITUDE TAPE) */}
                <div className="absolute right-6 top-1/4 h-1/2 w-16 flex flex-col justify-between border-l border-current/25 pl-3 py-6 text-right">
                  <div className="text-[8px] opacity-40">ALTITUDE</div>
                  <div className="font-bold border-b border-current py-1">384.4 km</div>
                  <div className="opacity-60">384.2</div>
                  <div className="opacity-60 font-bold bg-current/20 px-1 text-center py-0.5 rounded">384.0</div>
                  <div className="opacity-60">383.8</div>
                  <div className="text-[7px] text-zinc-500 font-mono">APOGEE T-15</div>
                </div>

                {/* HUD BOTTOM ROW: System status details, compass, life support */}
                <div className="flex justify-between items-end bg-gradient-to-t from-black/50 to-transparent p-4 rounded-b-xl">
                  
                  {/* Left Bottom corner */}
                  <div className="space-y-1">
                    <div className="flex gap-4">
                      <span>O2 COMPRESSION:</span>
                      <span className="font-bold text-emerald-400">NOMINAL (98.4%)</span>
                    </div>
                    <div className="flex gap-4">
                      <span>SUIT PRESSURE:</span>
                      <span className="font-bold">4.20 PSI [STABLE]</span>
                    </div>
                  </div>

                  {/* Compass heading tape (reacts horizontally to mouse position) */}
                  <div className="hidden sm:flex flex-col items-center w-64 border-x border-current/25 px-4">
                    <div className="flex justify-between w-full text-[8px] opacity-50 font-mono pb-1">
                      <span>W</span>
                      <span>280</span>
                      <span>290</span>
                      <span className="font-extrabold text-current underline">NW</span>
                      <span>310</span>
                      <span>320</span>
                      <span>N</span>
                    </div>
                    
                    {/* Tickmarks line */}
                    <div className="w-full h-1.5 border-t border-current flex justify-between relative">
                      <div className="absolute h-1.5 w-[2px] bg-current left-0" />
                      <div className="absolute h-1 w-[1px] bg-current left-1/4" />
                      <div className="absolute h-1.5 w-[2px] bg-current left-1/2" />
                      <div className="absolute h-1 w-[1px] bg-current left-3/4" />
                      <div className="absolute h-1.5 w-[2px] bg-current left-[99%]" />
                      
                      {/* Active needle marker */}
                      <div className="absolute -top-1 w-2 h-2 bg-current rotate-45" style={{ left: `calc(50% + ${smoothedMouse.x * 40}px)` }} />
                    </div>
                    
                    <div className="text-[10px] font-bold mt-1 text-center">
                      HEADING: {Math.floor(300 + smoothedMouse.x * 30)}° NW
                    </div>
                  </div>

                  {/* Right Bottom corner */}
                  <div className="text-right">
                    <div>BATTERY THERMAL:</div>
                    <div className="font-bold">24.2 kWh [84.5%]</div>
                    <div className="text-[8px] opacity-60">RADIATION LEVEL: 0.12 RAD/H</div>
                  </div>

                </div>

              </div>

              {/* Warning alarm bar */}
              {alarmActive && (
                <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-red-600 text-white font-mono font-bold text-xs px-6 py-2 rounded border border-red-500 flex items-center gap-2 animate-bounce z-40 shadow-lg">
                  <AlertOctagon className="w-4 h-4 animate-spin" />
                  <span>ALERT DEPRESS: CHECK COMPRESSION INTEGRITY SEAL</span>
                </div>
              )}

            </div>
          </div>

          {/* RIGHT PANEL: SIMULATOR CONTROLS (3 COLS) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Camera settings */}
            <div className="bg-white rounded-xl p-6 border border-black/10 shadow-sm space-y-4">
              <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 block mb-2 font-bold">UPLINK STREAM SENSORS</span>
              
              <div className="space-y-3 font-mono text-[10px]">
                <div className="flex justify-between items-center">
                  <span>WEBCAM INTERACTION:</span>
                  <button 
                    onClick={cameraActive ? stopWebcam : startWebcam}
                    className={`px-3 py-1.5 rounded text-[9px] font-bold tracking-wider uppercase cursor-pointer ${
                      cameraActive ? 'bg-red-100 text-red-800' : 'bg-black text-white hover:bg-zinc-800'
                    }`}
                  >
                    {cameraActive ? 'DISABLE CAM' : 'ENABLE CAM'}
                  </button>
                </div>

                {cameraError && (
                  <p className="text-[9px] text-amber-600 italic">
                    ⚠️ Camera feed blocked or unsupported in current frame. Simulated Deep Space Starfield overlay activated.
                  </p>
                )}

                <p className="text-[9px] text-zinc-400 leading-relaxed pt-2 border-t">
                  The HUD simulator maps navigation, acceleration vectoring and biosensor tapes over your camera frame or deep-space starfields.
                </p>
              </div>
            </div>

            {/* Shader filters configuration */}
            <div className="bg-white rounded-xl p-6 border border-black/10 shadow-sm space-y-4">
              <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 block mb-2 font-bold">FILTERS & CHROMATICS</span>
              
              <div className="space-y-3 font-mono text-[10px]">
                {/* Night Vision */}
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-zinc-700 block">NIGHT-VISION S-9</span>
                    <span className="text-[8px] text-zinc-400 block">530nm phosphor amplif.</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={nightVision}
                    onChange={(e) => {
                      setNightVision(e.target.checked);
                      if (e.target.checked) setThermalFilter(false);
                    }}
                    className="accent-black h-4 w-4 rounded border-zinc-300 cursor-pointer"
                  />
                </div>

                {/* Thermal */}
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-zinc-700 block">THERMAL RADAR SCAN</span>
                    <span className="text-[8px] text-zinc-400 block">Infrared heat-signature matrix.</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={thermalFilter}
                    onChange={(e) => {
                      setThermalFilter(e.target.checked);
                      if (e.target.checked) setNightVision(false);
                    }}
                    className="accent-black h-4 w-4 rounded border-zinc-300 cursor-pointer"
                  />
                </div>

                {/* Simulated Emergency */}
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-zinc-700 block">DEPRESS WARNING ALARM</span>
                    <span className="text-[8px] text-zinc-400 block">Emergency helmet strobe indicator.</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={alarmActive}
                    onChange={(e) => setAlarmActive(e.target.checked)}
                    className="accent-black h-4 w-4 rounded border-zinc-300 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Target Selectors */}
            <div className="bg-white rounded-xl p-6 border border-black/10 shadow-sm space-y-4">
              <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 block mb-2 font-bold">TARGET VECTOR CALIBRATION</span>
              
              <div className="space-y-2 font-mono text-[10px]">
                {[
                  { id: 'ISS_DOCKING_A', label: 'ISS DOCKING HANGER-9' },
                  { id: 'LUNAR_GATEWAY', label: 'LUNAR PORTWAY COMMAND' },
                  { id: 'LANDER_01', label: 'APOLLO CRATER SENSOR L1' },
                ].map((target) => (
                  <button
                    key={target.id}
                    onClick={() => setTargetLock(target.id as any)}
                    className={`w-full text-left py-2 px-3 text-[9px] font-bold border rounded transition-colors cursor-pointer ${
                      targetLock === target.id 
                        ? 'bg-black text-white border-black' 
                        : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-600'
                    }`}
                  >
                    [+] {target.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
