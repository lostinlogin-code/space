import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Screen, TelemetryData, SystemConfig, DiagnosticItem } from '../types';
import { 
  Heart, Shield, Battery, Navigation, Thermometer, Wind, Zap, 
  Activity, Settings, Terminal, Play, RotateCcw, AlertTriangle, Eye, Compass
} from 'lucide-react';

interface DashboardProps {
  onScreenChange: (screen: Screen) => void;
}

export default function DashboardView({ onScreenChange }: DashboardProps) {
  // Telemetry state simulating real-time fluctuations
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    heartRate: 72,
    oxygen: 98.4,
    suitPressure: 4.20,
    internalTemp: 36.6,
    externalTemp: -120.4,
    battery: 84.5,
    waterReserve: 91.2,
    propellant: 76.8,
    co2Scrub: 94.2,
    radiation: 0.12,
  });

  // Configurations state
  const [config, setConfig] = useState<SystemConfig>({
    visorPolarization: 'GOLD',
    recircRate: 'NOMINAL',
    thrusterDensity: 'MEDIUM',
    exoskeletonTorque: 45,
    nightVision: false,
    thermalFilter: false,
  });

  // Emergency flashing state
  const [emergencyAlert, setEmergencyAlert] = useState(false);

  // Diagnostic checklist states
  const [diagnostics, setDiagnostics] = useState<DiagnosticItem[]>([
    { id: 'o2_scrub', name: 'Oxygen Recycler Loop', status: 'OK', category: 'Life Support' },
    { id: 'thrust_vector', name: 'Hydrazine Thruster Vectors', status: 'OK', category: 'Propulsion' },
    { id: 'comms', name: 'X-Band Neural Uplink', status: 'OK', category: 'Power' },
    { id: 'haptic', name: 'Tactile Bio-Feedback', status: 'OK', category: 'Structural' },
    { id: 'radiate_shield', name: 'Radiative Electrostatic Shielding', status: 'WARNING', category: 'Structural' },
  ]);

  // Terminal Logs State
  const [logs, setLogs] = useState<string[]>([
    'VANGUARD SECURE BOOT UPLINK STABLE • SYS CONFIRMED',
    'AX-09 SUIT REGULATION AUTONOMY ON-STANDBY',
    'PRESSURE INTEGRITY NOMINAL - DIFFERENTIAL VALUE 4.20 PSI',
    'HELMET AR HUD OVERLAYS CONFIGURED [ACTIVE]'
  ]);

  // ECG Heartbeat wave drawing on Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ecgOffset = useRef(0);

  // Telemetry fluctuation effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetry(prev => {
        // Heart rate reacts slightly to exoskeleton torque, ambient fluctuations, or alarm state
        const hrBase = emergencyAlert ? 124 : 70 + Math.floor(config.exoskeletonTorque / 10);
        const hrDelta = Math.floor(Math.random() * 5) - 2;
        
        // Oxygen and propellant diminish slowly over time
        const newO2 = Math.max(0, prev.oxygen - 0.01);
        const newPropellant = Math.max(0, prev.propellant - 0.02);

        return {
          ...prev,
          heartRate: Math.max(50, Math.min(180, hrBase + hrDelta)),
          oxygen: parseFloat(newO2.toFixed(2)),
          suitPressure: parseFloat((4.20 + (Math.random() * 0.04 - 0.02)).toFixed(2)),
          internalTemp: parseFloat((36.6 + (Math.random() * 0.2 - 0.1)).toFixed(1)),
          externalTemp: parseFloat((-120.4 + (Math.random() * 4 - 2)).toFixed(1)),
          battery: parseFloat(Math.max(0, prev.battery - 0.005).toFixed(2)),
          propellant: parseFloat(newPropellant.toFixed(2)),
          radiation: parseFloat((0.10 + (Math.random() * 0.05)).toFixed(2))
        };
      });
    }, 1500);

    return () => clearInterval(timer);
  }, [config.exoskeletonTorque, emergencyAlert]);

  // Canvas drawing loop
  useEffect(() => {
    let animationId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || 300;
      canvas.height = 100;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const drawEcg = () => {
      ctx.fillStyle = 'rgba(9, 9, 11, 0.15)'; // Deep trail fade
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = emergencyAlert ? '#ef4444' : '#10b981'; // Red for alarm, green standard
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 4;
      ctx.shadowColor = emergencyAlert ? 'rgba(239, 68, 68, 0.5)' : 'rgba(16, 185, 129, 0.5)';

      ctx.beginPath();
      const midY = canvas.height / 2;
      
      // Calculate heartbeat frequency based on telemetry heart rate
      const hrFactor = telemetry.heartRate / 60; // relative speed multiplier
      
      for (let i = 0; i < canvas.width; i++) {
        let y = midY;
        const cycle = (i + ecgOffset.current) % Math.round(180 / hrFactor);
        
        // Simulated ECG pulse shape
        if (cycle > 40 && cycle < 43) {
          y = midY + 4; // P-wave dip
        } else if (cycle >= 43 && cycle < 46) {
          y = midY - 12; // P-wave peak
        } else if (cycle >= 48 && cycle < 50) {
          y = midY + 5; // PR-interval dip
        } else if (cycle >= 50 && cycle < 53) {
          y = midY - 35; // R-wave spike high
        } else if (cycle >= 53 && cycle < 56) {
          y = midY + 30; // S-wave spike low
        } else if (cycle >= 58 && cycle < 63) {
          y = midY - 8; // T-wave peak
        }

        if (i === 0) {
          ctx.moveTo(i, y);
        } else {
          ctx.lineTo(i, y);
        }
      }
      ctx.stroke();

      ecgOffset.current += 1.5 * (telemetry.heartRate / 70); // speed wave movement according to heart rate
      animationId = requestAnimationFrame(drawEcg);
    };

    drawEcg();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [telemetry.heartRate, emergencyAlert]);

  // Log adding function
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message.toUpperCase()}`, ...prev.slice(0, 15)]);
  };

  // Adjust configuration parameters
  const handleConfigChange = <K extends keyof SystemConfig>(key: K, value: SystemConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    addLog(`SYSTEM UPDATE: ${key.replace(/([A-Z])/g, ' $1')} CALIBRATED TO [${value}]`);
  };

  // Calibration action for diagnostics
  const handleCalibrate = (id: string, name: string) => {
    setDiagnostics(prev => 
      prev.map(item => item.id === id ? { ...item, status: 'CALIBRATING' } : item)
    );
    addLog(`CALIBRATING: Initiated deep structural diagnostic of ${name}...`);
    
    setTimeout(() => {
      setDiagnostics(prev => 
        prev.map(item => item.id === id ? { ...item, status: 'OK' } : item)
      );
      addLog(`CALIBRATED: ${name} fully aligned at 100% telemetry density.`);
    }, 3000);
  };

  // Toggle emergency alarm
  const toggleEmergency = () => {
    const newState = !emergencyAlert;
    setEmergencyAlert(newState);
    if (newState) {
      addLog('⚠️ CRITICAL WARNING: RED ALERT TRIGGERED. PRESSURE DIFFERENTIAL FLUIDITY UNCERTAIN.');
    } else {
      addLog('✅ SYSTEM CALM: Emergency protocols stand down. All levels return to nominal ranges.');
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 relative select-none p-6 md:p-12 ${
      emergencyAlert ? 'bg-red-950/20 text-red-50' : 'bg-zinc-50 text-black'
    }`}>
      
      {/* Alarm Flashing Indicator Overlay */}
      {emergencyAlert && (
        <div className="absolute inset-0 bg-red-600/5 animate-pulse pointer-events-none z-40" />
      )}

      <div className="max-w-7xl mx-auto">
        
        {/* Dashboard Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-black/10 pb-8 mb-8">
          <div>
            <span className="text-[10px] font-mono border border-black/15 bg-white/80 rounded-full px-3 py-1 text-zinc-500 uppercase tracking-widest">
              CONSOLE UPLINK: STABLE
            </span>
            <h1 className="text-4xl md:text-5xl font-technical uppercase mt-3" style={{ fontFamily: 'Anton, sans-serif' }}>
              AX-09 TELEMETRY CONTROL
            </h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <button 
              onClick={toggleEmergency}
              className={`inline-flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase px-5 py-3 rounded-full transition-all duration-300 cursor-pointer ${
                emergencyAlert 
                  ? 'bg-red-600 hover:bg-red-700 text-white animate-bounce' 
                  : 'bg-black text-white hover:bg-zinc-800'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{emergencyAlert ? 'STAND DOWN ALARM' : 'EMERGENCY PROTOCOL'}</span>
            </button>
            
            <button 
              onClick={() => onScreenChange('HUDSimulator')}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-zinc-100 border border-black/10 text-black text-[10px] font-bold tracking-widest uppercase px-5 py-3 rounded-full transition-all duration-300 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>LAUNCH HUD AR</span>
            </button>
          </div>
        </header>

        {/* 3-Column Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUMN 1: LIVE BIO-FEED & TELEMETRY DIALS (5 COLS) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Vitals & ECG Heart Rate Card */}
            <div className="bg-zinc-950 text-white rounded-xl p-6 border border-zinc-800 shadow-md">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Heart className={`w-4 h-4 ${emergencyAlert ? 'text-red-500 animate-ping' : 'text-emerald-400'}`} />
                  <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">BIOMETRIC VECTOR</span>
                </div>
                <div className="text-[10px] font-mono bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-emerald-400">
                  UPLINK SECURE
                </div>
              </div>

              {/* Huge Heart Rate Readout */}
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-5xl font-technical tracking-tighter" style={{ fontFamily: 'Anton, sans-serif' }}>
                  {telemetry.heartRate}
                </span>
                <span className="text-zinc-500 font-mono text-[10px]">BPM</span>
              </div>

              {/* Heartbeat ECG Live Canvas */}
              <div className="bg-zinc-900/60 border border-zinc-850 rounded-lg p-2 relative overflow-hidden mb-4">
                <canvas ref={canvasRef} className="w-full h-24 block" />
                <span className="absolute bottom-2 left-2 text-[8px] font-mono text-zinc-500">REAL-TIME ECG SENSOR S-9</span>
              </div>

              <div className="grid grid-cols-2 gap-4 font-mono text-[10px]">
                <div className="bg-zinc-900/40 p-3 rounded-lg border border-zinc-800/60">
                  <span className="text-zinc-500 uppercase block mb-1">Internal Temp</span>
                  <div className="flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="text-zinc-200 font-bold text-sm">{telemetry.internalTemp} °C</span>
                  </div>
                </div>
                <div className="bg-zinc-900/40 p-3 rounded-lg border border-zinc-800/60">
                  <span className="text-zinc-500 uppercase block mb-1">OXYGEN RESERVE</span>
                  <div className="flex items-center gap-1">
                    <Wind className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="text-zinc-200 font-bold text-sm">{telemetry.oxygen}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Environment & Mechanical Telemetry Metrics */}
            <div className="bg-white rounded-xl p-6 border border-black/10 shadow-sm space-y-4">
              <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 block mb-2 font-bold">PHYSICAL TELEMETRY DIAGNOSTICS</span>
              
              <div className="grid grid-cols-2 gap-4 font-mono text-[11px]">
                {[
                  { icon: <Shield className="w-4 h-4 text-zinc-500" />, label: 'Suit Pressure', val: `${telemetry.suitPressure} PSI`, stat: 'NOMINAL' },
                  { icon: <Thermometer className="w-4 h-4 text-zinc-500" />, label: 'External Temp', val: `${telemetry.externalTemp} °C`, stat: 'LOCKED' },
                  { icon: <Battery className="w-4 h-4 text-zinc-500" />, label: 'Main Battery', val: `${telemetry.battery}%`, stat: 'STABLE' },
                  { icon: <Zap className="w-4 h-4 text-zinc-500" />, label: 'CO2 Scrubber', val: `${telemetry.co2Scrub}%`, stat: 'SECURED' },
                  { icon: <Navigation className="w-4 h-4 text-zinc-500" />, label: 'Propellant fuel', val: `${telemetry.propellant}%`, stat: 'CAPACITY' },
                  { icon: <Activity className="w-4 h-4 text-zinc-500" />, label: 'Ambient Radiation', val: `${telemetry.radiation} rad/h`, stat: 'SAFE' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-zinc-50 p-3 rounded border border-black/5 flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-1.5 text-zinc-400">
                      {item.icon}
                      <span className="uppercase text-[9px] tracking-wider text-zinc-500">{item.label}</span>
                    </div>
                    <div className="text-zinc-900 font-extrabold text-xs">{item.val}</div>
                    <div className="text-[8px] text-zinc-400 font-medium text-right mt-1.5">{item.stat}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* COLUMN 2: SUIT CONFIGURATOR PANEL (4 COLS) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-xl p-6 border border-black/10 shadow-sm space-y-6">
              
              <div className="flex items-center gap-2 border-b border-black/5 pb-4 mb-4">
                <Settings className="w-4 h-4 text-black" />
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-400">SYSTEM PARAMETER TUNING</span>
              </div>

              {/* Visor Polarization Selection */}
              <div className="space-y-2">
                <label className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-500 block">VISOR HELMET COLOR MODE</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['MIRROR', 'GOLD', 'INFRARED', 'THERMAL'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => handleConfigChange('visorPolarization', mode)}
                      className={`py-2 px-3 text-[10px] font-mono border rounded transition-all cursor-pointer ${
                        config.visorPolarization === mode 
                          ? 'bg-black text-white border-black font-bold' 
                          : 'bg-zinc-50 text-zinc-500 border-zinc-200 hover:bg-zinc-100 hover:text-black'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
                <p className="text-[9px] text-zinc-400 font-mono italic mt-1">
                  {config.visorPolarization === 'GOLD' && '✓ Heavy UV filter. Max visible solar rays shield.'}
                  {config.visorPolarization === 'MIRROR' && '✓ Basic silver-chrome light deflection active.'}
                  {config.visorPolarization === 'INFRARED' && '✓ Enhanced visual wavelength for shadow-zones.'}
                  {config.visorPolarization === 'THERMAL' && '✓ Heat trace overlay display activated in visor.'}
                </p>
              </div>

              {/* Life support recycle rate */}
              <div className="space-y-2">
                <label className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-500 block">RECYCLER FLOW RATE</label>
                <div className="flex border rounded overflow-hidden">
                  {(['CONSERVATIVE', 'NOMINAL', 'MAXIMUM'] as const).map((rate) => (
                    <button
                      key={rate}
                      onClick={() => handleConfigChange('recircRate', rate)}
                      className={`flex-1 py-2 text-[9px] font-mono text-center transition-all cursor-pointer ${
                        config.recircRate === rate 
                          ? 'bg-black text-white font-extrabold' 
                          : 'bg-zinc-50 text-zinc-500 hover:bg-zinc-100 hover:text-black'
                      }`}
                    >
                      {rate.substring(0, 4)}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-[9px] font-mono text-zinc-400 mt-1">
                  <span>Nominal O2 Rate:</span>
                  <span className="text-zinc-800 font-bold">
                    {config.recircRate === 'CONSERVATIVE' && '12.0 Hrs (Low O2)'}
                    {config.recircRate === 'NOMINAL' && '8.5 Hrs (Nominal)'}
                    {config.recircRate === 'MAXIMUM' && '4.2 Hrs (High O2 boost)'}
                  </span>
                </div>
              </div>

              {/* Exoskeleton torque assist slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-500">EXOSKELETON TORQUE ASSIST</label>
                  <span className="font-mono text-xs font-bold text-black">{config.exoskeletonTorque} N•m</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={config.exoskeletonTorque} 
                  onChange={(e) => handleConfigChange('exoskeletonTorque', parseInt(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
                <div className="flex justify-between text-[8px] font-mono text-zinc-400">
                  <span>0% (Manual)</span>
                  <span>100% (High Assist)</span>
                </div>
              </div>

              {/* Visor Toggle options */}
              <div className="space-y-3 pt-3 border-t border-black/5 font-mono text-[10px]">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 font-bold">NIGHT VISION AMPLITUDE</span>
                  <input 
                    type="checkbox" 
                    checked={config.nightVision}
                    onChange={(e) => handleConfigChange('nightVision', e.target.checked)}
                    className="accent-black h-4 w-4 rounded border-zinc-300"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 font-bold">THERMAL CHROMATIC FILTER</span>
                  <input 
                    type="checkbox" 
                    checked={config.thermalFilter}
                    onChange={(e) => handleConfigChange('thermalFilter', e.target.checked)}
                    className="accent-black h-4 w-4 rounded border-zinc-300"
                  />
                </div>
              </div>

              {/* AI Link and Quick CTA */}
              <div className="bg-zinc-50 p-4 border border-black/5 rounded-lg text-center font-mono">
                <span className="text-[8px] text-zinc-400 block mb-1">NEED COMPLEX PROTOCOLS assistance?</span>
                <button 
                  onClick={() => onScreenChange('AICommand')}
                  className="w-full text-center bg-black hover:bg-zinc-800 text-white py-2 rounded-lg text-[9px] font-bold tracking-widest uppercase transition-colors"
                >
                  DEBRIEF VANGUARD AI CO-PILOT
                </button>
              </div>

            </div>
          </div>

          {/* COLUMN 3: SYSTEM DIAGNOSTICS CHECKLIST & SYSTEM LOGS (3 COLS) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Interactive Diagnostics list */}
            <div className="bg-white rounded-xl p-6 border border-black/10 shadow-sm space-y-4">
              <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 block mb-2 font-bold">SUB-SYSTEM LOCK STATUS</span>
              
              <div className="space-y-3 font-mono text-[10px]">
                {diagnostics.map((item) => (
                  <div key={item.id} className="flex justify-between items-center border-b border-black/5 pb-2">
                    <div>
                      <span className="text-[8px] text-zinc-400 block uppercase leading-none">{item.category}</span>
                      <span className="text-zinc-900 font-extrabold">{item.name}</span>
                    </div>
                    
                    <div className="flex flex-col items-end gap-1.5">
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                        item.status === 'OK' && 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      } ${
                        item.status === 'WARNING' && 'bg-amber-100 text-amber-800 border border-amber-200'
                      } ${
                        item.status === 'CALIBRATING' && 'bg-indigo-100 text-indigo-800 border border-indigo-200 animate-pulse'
                      }`}>
                        {item.status}
                      </span>
                      
                      {item.status !== 'CALIBRATING' && (
                        <button 
                          onClick={() => handleCalibrate(item.id, item.name)}
                          className="text-[8px] text-zinc-500 font-bold border-b border-zinc-400 hover:text-black"
                        >
                          ALIGN
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rolling System logs terminal */}
            <div className="bg-zinc-950 text-emerald-400 rounded-xl p-5 border border-zinc-800 font-mono text-[9px] shadow-inner space-y-3">
              <div className="flex justify-between items-center border-b border-zinc-850 pb-2 text-zinc-500 uppercase tracking-widest font-bold">
                <div className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>HEX DECRYPT LOGS</span>
                </div>
                <button 
                  onClick={() => setLogs(['LOG BUFFER FLUSHED', `STANDBY LINK STABLE: ${new Date().toLocaleTimeString()}`])}
                  className="hover:text-emerald-300 flex items-center gap-1 text-[8px]"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>FLUSH</span>
                </button>
              </div>

              <div className="h-56 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
                {logs.map((log, index) => (
                  <div key={index} className="leading-relaxed border-l-2 border-emerald-500/30 pl-2">
                    {log}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
