import { useState, useRef, useEffect } from 'react';
import { Screen, ChatMessage } from '../types';
import { Cpu, Send, ShieldCheck, AlertCircle, RefreshCw, Terminal, Compass, ArrowDown, HelpCircle } from 'lucide-react';

interface AICommandProps {
  onScreenChange: (screen: Screen) => void;
}

export default function AICommandView({ onScreenChange }: AICommandProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'VANGUARD-9 ORBITAL NEURAL LINK STANDBY. Uplink securely synchronized with Ather Command. I have full telemetry diagnostics for your AX-09 life-support suit. Custom maneuvering calculations and emergency response protocols are armed. What is your query, commander?',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeProtocol, setActiveProtocol] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Quick Action Emergency Protocols list
  const quickProtocols = [
    {
      id: 'solar_flare',
      title: 'Solar Radiation Flare Threat',
      desc: 'Calculate electromagnetic shield deflection and secondary layer thermal resistance.',
      prompt: 'Emergency protocol: Detect massive solar flare activity. Calculate magnetic grid shield settings and exposure safety margins.'
    },
    {
      id: 'pressure_leak',
      title: 'Visor Compression Seal Leak',
      desc: 'Execute diagnostic scan on pressure seal.Tweak recycler gas levels to maintain joint flexion.',
      prompt: 'Emergency protocol: Pressure differential anomaly. Initiate emergency seal recovery procedures and O2 flow optimization.'
    },
    {
      id: 'thruster_align',
      title: 'Hydrazine Thruster Calibration',
      desc: 'Coordinate pitch and yaw vectors for manual lunar lander capture alignment.',
      prompt: 'Maneuvering calculation: Compute pitch, roll, and delta-v burn parameters for active ISS orbital docking.'
    },
    {
      id: 'suit_temp',
      title: 'Extreme Radiative Cooling',
      desc: 'Calibrate water heat loops and adjust suit interior manifolds against deep shadow conditions.',
      prompt: 'System advisory: Suit exterior temperature falling below -150°C. Check thermal heating manifolds and adjust recycler recycle loops.'
    }
  ];

  const handleSendMessage = async (userMessageText: string) => {
    if (!userMessageText.trim() || loading) return;

    const timestamp = new Date().toLocaleTimeString();
    
    // Add User Message
    const updatedMessages = [
      ...messages,
      { role: 'user' as const, content: userMessageText, timestamp }
    ];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      // API request to server-side Gemini endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessageText,
          history: updatedMessages.slice(1, -1) // slice to exclude the very first system message and current message
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: data.text,
            timestamp: new Date().toLocaleTimeString()
          }
        ]);
      } else {
        throw new Error(data.error || 'Connection severed');
      }

    } catch (err: any) {
      console.error("Neural link chat error:", err);
      
      // Smart offline / emergency simulated response generator (fallback)
      let fallbackText = `NEURAL LINK UPLINK INTERRUPTED. Operational local simulation mode engaged. Pre-compiled standard advisory for query: "${userMessageText.substring(0, 30)}...":\n\n`;
      
      const lower = userMessageText.toLowerCase();
      if (lower.includes('solar') || lower.includes('flare') || lower.includes('radiation')) {
        fallbackText += `⚠️ VANGUARD LOCAL ADVISORY - SOLAR SHIELDING ACTIVATED:\n` +
                        `- Rotate EVA backpack solar panels Sunward to prioritize primary emergency induction batteries.\n` +
                        `- Tweak electromagnetic shield density to MAXIMUM on grid 04-alpha.\n` +
                        `- Retract HUD visor gold reflector layer to maximum polarized opacity.\n` +
                        `- Seek immediate habitat shelter or lander containment module. Limit remaining EVA time to 180 seconds.`;
      } else if (lower.includes('pressure') || lower.includes('leak') || lower.includes('seal')) {
        fallbackText += `⚠️ VANGUARD LOCAL ADVISORY - PRESSURE LEAK PROTOCOL:\n` +
                        `- Emergency expansion foam injected into joint cuff seals A and B.\n` +
                        `- Recycler Flow Rate automatically overridden to MAXIMUM to sustain 4.20 psi.\n` +
                        `- Commencing interior cabin localized backup pressurization.\n` +
                        `- Check mechanical wrist ring connectors and helmet dome latch seal rings visually for structural deformation.`;
      } else if (lower.includes('thruster') || lower.includes('dock') || lower.includes('v-burn') || lower.includes('docking')) {
        fallbackText += `🚀 VANGUARD LOCAL ADVISORY - FLIGHT CONTROL CALIBRATION:\n` +
                        `- Cold-gas Hydrazine propellant manifold lines aligned. Gas pressure stable at 240 bar.\n` +
                        `- Pitch vectors initialized. Yaw thrusters trim set to -0.04 degrees.\n` +
                        `- Delta-V burn planned: Ignite left lateral cold nozzle for 2.4 seconds to secure visual alignment target.\n` +
                        `- Standby for manual capture vectors. Exoskeleton assistance locked in orbit-grip mode.`;
      } else {
        fallbackText += `🤖 VANGUARD LOG COMPILATION:\n` +
                        `Your AX-09 telemetry systems are operating normally. Vitals nominal, core temperature 36.6 °C, O2 reserves holding at 8.5 hours. Ensure haptic sensors are calibrated on next module cycling. Submit specific telemetry queries for orbital checklist assistance.`;
      }

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: fallbackText,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-6 md:p-12 select-none">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-black/10 pb-6 mb-8">
          <div>
            <span className="text-[10px] font-mono border border-black/15 bg-white rounded-full px-3 py-1 text-zinc-500 uppercase tracking-widest">
              AI ASSISTANT: VANGUARD-9 ON-BOARD APEX
            </span>
            <h1 className="text-4xl md:text-5xl font-technical uppercase mt-3" style={{ fontFamily: 'Anton, sans-serif' }}>
              FLIGHT COMMAND NEURAL LINK
            </h1>
          </div>

          <button 
            onClick={() => onScreenChange('Dashboard')}
            className="bg-black hover:bg-zinc-800 text-white text-[10px] font-bold tracking-widest uppercase px-5 py-3 rounded-full transition-all cursor-pointer"
          >
            TELEMETRY DASHBOARD
          </button>
        </header>

        {/* 2-Column Chat & Actions Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT COLUMN: ACTIVE INTERACTIVE COMM-LOG (8 COLS) */}
          <div className="lg:col-span-8 flex flex-col justify-between bg-zinc-950 text-white rounded-xl border border-zinc-850 shadow-2xl h-[650px] relative">
            
            {/* Terminal Top Bar */}
            <div className="flex justify-between items-center bg-zinc-900 border-b border-zinc-850 px-6 py-3.5 rounded-t-xl">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 font-extrabold">NEURAL TELEMETRY LINK ACTIVE</span>
              </div>
              <div className="text-[8px] font-mono text-zinc-500">REF: ATH-V9-CO-PILOT</div>
            </div>

            {/* Scrolling Chat Logs */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin scrollbar-thumb-zinc-800">
              {messages.map((msg, idx) => (
                <div 
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-lg p-4 font-mono text-xs border ${
                    msg.role === 'user' 
                      ? 'bg-zinc-900 border-zinc-800 text-zinc-100 rounded-tr-none' 
                      : 'bg-zinc-950 border-zinc-900 text-emerald-400 rounded-tl-none leading-relaxed'
                  }`}>
                    <div className="flex justify-between items-center gap-8 mb-2 border-b border-zinc-900 pb-1 text-[8px] opacity-60">
                      <span className="font-bold tracking-widest">
                        {msg.role === 'user' ? 'ASTRONAUT_COMS_OUT' : 'VANGUARD_DEC_IN'}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>
                    
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}

              {/* Neural Loading indicators */}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-950 border border-zinc-900 rounded-lg rounded-tl-none p-4 font-mono text-xs text-zinc-400 flex items-center gap-3">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                    <span className="text-[9px] uppercase tracking-widest animate-pulse">Calculating telemetry trajectories / compiling protocols...</span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Field form */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(input);
              }}
              className="p-4 bg-zinc-900 border-t border-zinc-850 rounded-b-xl flex gap-3 items-center"
            >
              <div className="flex-1 bg-zinc-950 rounded border border-zinc-800 px-3 py-2.5 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-zinc-500" />
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="INPUT COMMAND OR TELEMETRY QUESTION (e.g. check visor seal integrity)..."
                  className="bg-transparent text-white font-mono text-xs outline-none w-full placeholder-zinc-600 uppercase"
                  disabled={loading}
                />
              </div>

              <button 
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-white hover:bg-zinc-200 text-black p-3 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>

          {/* RIGHT COLUMN: QUICK DIAGNOSTIC ACTION PROTOCOLS (4 COLS) */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white rounded-xl p-6 border border-black/10 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b pb-3 text-zinc-400 font-bold font-mono">
                <Cpu className="w-4 h-4 text-black" />
                <span className="text-[9px] uppercase tracking-widest">EMERGENCY PRESETS</span>
              </div>
              
              <p className="text-[10px] text-zinc-400 font-mono leading-relaxed pb-2">
                Deploy critical diagnostic sequences or telemetry requests to Vanguard co-pilot immediately.
              </p>

              <div className="space-y-3">
                {quickProtocols.map((protocol) => (
                  <div 
                    key={protocol.id}
                    onClick={() => {
                      setActiveProtocol(protocol.id);
                      handleSendMessage(protocol.prompt);
                    }}
                    className={`p-4 rounded-lg border text-left cursor-pointer transition-all ${
                      activeProtocol === protocol.id 
                        ? 'bg-black text-white border-black shadow-md' 
                        : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-black'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[9px] font-mono font-extrabold uppercase tracking-widest opacity-60">ACTION DETECTED</span>
                      <ShieldCheck className={`w-3.5 h-3.5 ${activeProtocol === protocol.id ? 'text-emerald-400' : 'text-zinc-400'}`} />
                    </div>
                    <h3 className="font-technical text-xl uppercase leading-none mb-2" style={{ fontFamily: 'Anton, sans-serif' }}>
                      {protocol.title}
                    </h3>
                    <p className={`text-[9px] font-mono leading-normal ${activeProtocol === protocol.id ? 'text-zinc-300' : 'text-zinc-500'}`}>
                      {protocol.desc}
                    </p>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => {
                  setActiveProtocol(null);
                  setMessages([
                    {
                      role: 'assistant',
                      content: 'Neural link buffer cleared. Standing by for fresh telemetry inputs, commander.',
                      timestamp: new Date().toLocaleTimeString()
                    }
                  ]);
                }}
                className="w-full text-center border border-dashed border-zinc-300 hover:border-black text-zinc-500 hover:text-black py-2.5 rounded-lg text-[9px] font-mono font-bold tracking-wider uppercase transition-colors"
              >
                RESET NEURAL CONSOLE HISTORY
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
