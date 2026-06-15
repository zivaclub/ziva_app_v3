import { useState } from "react";
import { motion } from "motion/react";
import { Heart, Activity, Brain, ShieldAlert, Award, Zap } from "lucide-react";

interface PartDetail {
  id: string;
  name: string;
  score: number;
  status: string;
  statusColor: string;
  desc: string;
  vitals: { label: string; value: string; color: string }[];
}

export default function BodyVisualizer() {
  const [selectedPart, setSelectedPart] = useState<string>("heart");

  const parts: Record<string, PartDetail> = {
    heart: {
      id: "heart",
      name: "HEART",
      score: 82,
      status: "Good",
      statusColor: "text-green-400 border-green-500/30 bg-green-500/10",
      desc: "+6 BPM vs last month. Consistent cardio loads have stimulated positive stroke volume adjustments.",
      vitals: [
        { label: "Resting Heart Rate", value: "72 BPM", color: "text-green-400" },
        { label: "Cardio Endurance", value: "78%", color: "text-purple-400" },
        { label: "Improvement Index", value: "+8% ▲", color: "text-emerald-400" }
      ]
    },
    lungs: {
      id: "lungs",
      name: "LUNGS",
      score: 78,
      status: "Improving",
      statusColor: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",
      desc: "Your lung capacity is improving. Deep oxygen absorption metrics are up by 5% over consecutive sprint intervals.",
      vitals: [
        { label: "Breathing Efficiency", value: "81%", color: "text-green-400" },
        { label: "Endurance Capacity", value: "75%", color: "text-yellow-400" },
        { label: "Respiratory Strength", value: "73%", color: "text-orange-400" }
      ]
    },
    biceps: {
      id: "biceps",
      name: "BICEPS / ARMS",
      score: 74,
      status: "Steady",
      statusColor: "text-blue-400 border-blue-500/30 bg-blue-500/10",
      desc: "Balanced arm strength supports exceptional smash torque. Moderate lactic buffer observed during recent trials.",
      vitals: [
        { label: "Isometric Pull Force", value: "62 kg", color: "text-blue-400" },
        { label: "Trigger Reaction", value: "0.19s", color: "text-green-400" },
        { label: "Muscular Stress", value: "Normal", color: "text-emerald-400" }
      ]
    },
    calves: {
      id: "calves",
      name: "CALVES / LEGS",
      score: 69,
      status: "Improving",
      statusColor: "text-amber-400 border-amber-500/30 bg-amber-500/10",
      desc: "Your calf strength and explosive power are improving. Ground reaction forces show optimized heel-to-toe transition.",
      vitals: [
        { label: "Explosive Power", value: "65%", color: "text-amber-400" },
        { label: "Sprint Endurance", value: "70%", color: "text-green-400" },
        { label: "Myofibrillar Strength", value: "72%", color: "text-green-400" }
      ]
    },
    posture: {
      id: "posture",
      name: "POSTURE / SPINE",
      score: 63,
      status: "Needs Attention",
      statusColor: "text-red-400 border-red-500/30 bg-red-500/10",
      desc: "Forward neck posture and slight shoulder imbalance detected. Alignment core stability exercises recommended immediately.",
      vitals: [
        { label: "Neck Alignment", value: "58%", color: "text-red-400" },
        { label: "Shoulder Balance", value: "64%", color: "text-orange-400" },
        { label: "Spinal Alignment", value: "68%", color: "text-yellow-400" }
      ]
    },
    core: {
      id: "core",
      name: "CORE SHIELD",
      score: 76,
      status: "Good",
      statusColor: "text-green-400 border-green-500/30 bg-green-500/10",
      desc: "Strong abdominal wall brace protects your lower spine from rotational torque during lateral movements.",
      vitals: [
        { label: "Rotational Torque Strength", value: "82 Nm", color: "text-green-400" },
        { label: "Plank Duration Capacity", value: "190s", color: "text-purple-400" },
        { label: "Intercostal Stability", value: "74%", color: "text-blue-400" }
      ]
    },
    brain: {
      id: "brain",
      name: "BRAIN / FOCUS",
      score: 81,
      status: "Good",
      statusColor: "text-green-400 border-green-500/30 bg-green-500/10",
      desc: "Your cognitive health and tactical focus are in great shape! Alpha brainwave stability maintains rapid court readouts.",
      vitals: [
        { label: "Focus & Attention", value: "82%", color: "text-green-400" },
        { label: "Tactical Memory", value: "78%", color: "text-emerald-400" },
        { label: "Mental Stamina", value: "76%", color: "text-purple-400" }
      ]
    }
  };

  const activeData = parts[selectedPart];

  return (
    <div className="bg-[#050508] p-4 rounded-3xl border border-white/5 space-y-6">
      {/* Upper Status Block */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#121217] p-5 rounded-2xl border border-white/5 relative overflow-hidden">
          <div className="absolute right-[-20px] bottom-[-20px] opacity-[0.03] text-brand">
            <Activity size={120} />
          </div>
          <span className="text-gray-400 text-xs font-medium uppercase tracking-widest block mb-1">Health Score</span>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold font-display text-white">82</span>
            <span className="text-gray-500 text-sm">/100</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-brand font-medium">
            <span className="flex h-2 w-2 rounded-full bg-brand animate-ping" />
            <span>+7 This Month</span>
          </div>
        </div>

        <div className="bg-[#121217] p-5 rounded-2xl border border-white/5 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-brand-purple tracking-widest uppercase block mb-1">Streak Status</span>
            <p className="text-white text-xs leading-relaxed font-medium">
              {selectedPart === "posture" 
                ? "Better posture today, stronger tomorrow."
                : selectedPart === "lungs"
                ? "You are doing great! Keep building consistency."
                : selectedPart === "brain"
                ? "Great focus! A strong mind drives a strong body."
                : "Consistency is building a stronger athlete."}
            </p>
          </div>
          <div className="text-[10px] text-gray-500 mt-2 flex items-center gap-1">
            <Award size={12} className="text-brand" />
            <span>Activity Tier: Elite Level</span>
          </div>
        </div>
      </div>

      {/* Holographic Interactive Body Canvas */}
      <div className="relative bg-gradient-to-b from-[#0e0e14] to-[#040407] rounded-2xl border border-white/5 py-8 px-4 flex flex-col items-center overflow-hidden min-h-[380px]">
        {/* Hologram details */}
        <div className="absolute top-4 left-4 text-[10px] font-mono text-gray-500 space-y-0.5">
          <div>SYS_BIOMETRIC_LINK: ON</div>
          <div>MODEL: A_WARRIOR_M_12</div>
          <div>SCAN_RESOLUTION: 256px_GRID</div>
        </div>
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-brand-purple/15 text-brand-purple/90 border border-brand-purple/20 px-2 py-0.5 rounded-full text-[10px] font-medium">
          <Zap size={10} className="animate-pulse" />
          <span>Tap parts to explore</span>
        </div>

        {/* 3D Human Blueprint Interactive SVG */}
        <div className="w-64 h-72 relative flex items-center justify-center">
          {/* Subtle Background Rings */}
          <div className="absolute w-56 h-56 rounded-full border border-brand-purple/5 animate-spin" style={{ animationDuration: "15s" }} />
          <div className="absolute w-44 h-44 rounded-full border border-brand/5 animate-spin" style={{ animationDuration: "8s", animationDirection: "reverse" }} />

          {/* Glowing Organs underlays */}
          {selectedPart === "brain" && (
            <div className="absolute top-[8%] w-12 h-12 rounded-full bg-brand/30 blur-md pointer-events-none" />
          )}
          {selectedPart === "heart" && (
            <div className="absolute top-[28%] w-10 h-10 rounded-full bg-red-500/20 blur-md pointer-events-none" />
          )}
          {selectedPart === "lungs" && (
            <div className="absolute top-[25%] w-14 h-12 rounded-full bg-brand-purple/25 blur-md pointer-events-none" />
          )}
          {selectedPart === "posture" && (
            <div className="absolute top-[20%] bottom-[40%] w-3 bg-yellow-400/30 blur-sm pointer-events-none" />
          )}
          {selectedPart === "biceps" && (
            <div className="absolute top-[32%] w-40 h-8 flex justify-between pointer-events-none">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 blur-sm" />
              <div className="w-8 h-8 rounded-full bg-blue-500/20 blur-sm" />
            </div>
          )}
          {selectedPart === "calves" && (
            <div className="absolute bottom-[10%] w-20 h-10 flex justify-between pointer-events-none">
              <div className="w-6 h-10 rounded-full bg-amber-500/20 blur-sm" />
              <div className="w-6 h-10 rounded-full bg-amber-500/20 blur-sm" />
            </div>
          )}

          {/* Human Body SVG */}
          <svg viewBox="0 0 100 120" className="w-full h-full text-blue-500/30 stroke-2 drop-shadow-[0_0_15px_rgba(30,144,255,0.15)]">
            {/* Outline Figure */}
            <path
              d="M 50,5 C 53,5 55,8 55,13 C 55,18 52,21 50,21 C 48,21 45,18 45,13 C 45,8 47,5 50,5 Z 
                 M 45,21 C 36,26 31,31 29,35 C 27,39 24,50 25,60 C 25,63 27,65 29,62 C 30,55 31,48 31,43 H 34 C 33,52 35,61 36,70 C 37,79 38,88 37,97 C 36,104 38,109 40,111 C 41,112 43,112 43,109 C 43,99 44,90 45,80 C 46,75 48,65 50,65 C 52,65 54,75 55,80 C 56,90 57,99 57,109 C 57,112 59,112 60,111 C 62,109 64,104 63,97 C 62,88 63,79 64,70 C 65,61 67,52 66,43 H 69 C 69,48 70,55 71,62 C 73,65 75,63 75,60 C 76,50 73,39 71,35 C 69,31 64,26 55,21 Z"
              fill="currentColor"
              fillOpacity="0.08"
              stroke="rgba(59, 130, 246, 0.45)"
              strokeWidth="0.8"
            />

            {/* Glowing spine outline for Posture */}
            {selectedPart === "posture" && (
              <path
                d="M 50,21 L 50,65 M 48,26 H 52 M 48,31 H 52 M 48,36 H 52 M 48,41 H 52 M 48,46 H 52 M 48,51 H 52 M 48,56 H 52"
                stroke="#fbbf24"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.9"
                className="animate-pulse"
              />
            )}

            {/* Specific clickable node points */}
            {/* Brain */}
            <circle cx="50" cy="13" r="4.5" className={`cursor-pointer transition-all duration-300 ${selectedPart === "brain" ? "fill-brand stroke-white stroke-[1.5px]" : "fill-brand-purple/60 hover:fill-brand"}`} onClick={() => setSelectedPart("brain")} />
            
            {/* Heart */}
            <circle cx="50" cy="29" r="3.5" className={`cursor-pointer transition-all duration-300 ${selectedPart === "heart" ? "fill-red-500 stroke-white stroke-[1.5px]" : "fill-pink-500/60 hover:fill-red-500"}`} onClick={() => setSelectedPart("heart")} />
            
            {/* Lungs */}
            <polygon points="46,28 42,35 48,38" className={`cursor-pointer transition-all duration-300 ${selectedPart === "lungs" ? "fill-brand stroke-white stroke-[1]" : "fill-brand-purple/40 hover:fill-brand"}`} onClick={() => setSelectedPart("lungs")} />
            <polygon points="54,28 58,35 52,38" className={`cursor-pointer transition-all duration-300 ${selectedPart === "lungs" ? "fill-brand stroke-white stroke-[1]" : "fill-brand-purple/40 hover:fill-brand"}`} onClick={() => setSelectedPart("lungs")} />

            {/* Arms / Biceps */}
            <circle cx="28" cy="38" r="3" className={`cursor-pointer transition-all duration-300 ${selectedPart === "biceps" ? "fill-blue-400 stroke-white stroke-[1]" : "fill-blue-500/40 hover:fill-blue-400"}`} onClick={() => setSelectedPart("biceps")} />
            <circle cx="72" cy="38" r="3" className={`cursor-pointer transition-all duration-300 ${selectedPart === "biceps" ? "fill-blue-400 stroke-white stroke-[1]" : "fill-blue-500/40 hover:fill-blue-400"}`} onClick={() => setSelectedPart("biceps")} />

            {/* Core */}
            <rect x="44" y="44" width="12" height="12" rx="2" className={`cursor-pointer transition-all duration-300 ${selectedPart === "core" ? "fill-emerald-400 stroke-white stroke-[1]" : "fill-emerald-500/30 hover:fill-emerald-400"}`} onClick={() => setSelectedPart("core")} />

            {/* Calves */}
            <circle cx="39" cy="85" r="3" className={`cursor-pointer transition-all duration-300 ${selectedPart === "calves" ? "fill-amber-400 stroke-white stroke-[1]" : "fill-amber-500/30 hover:fill-amber-400"}`} onClick={() => setSelectedPart("calves")} />
            <circle cx="61" cy="85" r="3" className={`cursor-pointer transition-all duration-300 ${selectedPart === "calves" ? "fill-amber-400 stroke-white stroke-[1]" : "fill-amber-500/30 hover:fill-amber-400"}`} onClick={() => setSelectedPart("calves")} />
          </svg>
        </div>

        {/* Selected Part Floating Stats HUD */}
        <div className="absolute bottom-5 left-4 right-4 bg-[#121217]/95 border border-white/10 p-3 rounded-xl flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-brand-purple/20 text-brand">
              {selectedPart === "brain" ? <Brain size={14} /> : <Heart size={14} />}
            </span>
            <div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-gray-400">Selected Region</div>
              <div className="text-xs font-bold text-white uppercase">{activeData.name}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-gray-400">Score Rating</div>
            <div className="text-xs font-bold text-brand font-mono">{activeData.score}%</div>
          </div>
        </div>
      </div>

      {/* Diagnosis Breakdown Overlay Panel (Matches Pages 12-16 Style) */}
      <div className="bg-[#121217] p-5 rounded-2xl border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-lg font-bold font-display tracking-tight text-white">{activeData.name} STATUS</h4>
            <span className={`text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded border ${activeData.statusColor}`}>
              {activeData.status}
            </span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-extrabold font-display text-brand">{activeData.score}%</div>
            <div className="text-[9px] uppercase tracking-wider text-gray-500">Overall Segment</div>
          </div>
        </div>

        <p className="text-xs text-gray-400 leading-relaxed font-normal bg-[#0a0a0d] p-3.5 rounded-xl border border-white/[0.02]">
          {activeData.desc}
        </p>

        {/* Dynamic Vitals Indicators grids */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          {activeData.vitals.map((v, idx) => (
            <div key={idx} className="bg-[#050508] p-3 rounded-xl border border-white/[0.04]">
              <div className="text-[9px] uppercase tracking-wider text-gray-500 text-ellipsis overflow-hidden whitespace-nowrap mb-1">
                {v.label}
              </div>
              <div className={`text-sm font-bold font-mono ${v.color}`}>
                {v.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Horizontal Nav Tabs list for body segments (Matches Page Footer Horizontal selector list) */}
      <div>
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Diagnostic Channels</div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {Object.values(parts).map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPart(p.id)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex-shrink-0 flex items-center gap-1.5 ${
                selectedPart === p.id
                  ? "bg-brand text-black border-brand font-bold shadow-lg shadow-brand/10"
                  : "bg-[#121217] text-gray-400 border-white/5 hover:border-white/15"
              }`}
            >
              <span>{p.id === "brain" ? "🧠" : p.id === "heart" ? "❤️" : p.id === "lungs" ? "🫁" : p.id === "posture" ? "🦒" : "💪"}</span>
              <span className="capitalize">{p.id}</span>
              <span className="text-[9px] font-mono opacity-80">({p.score}%)</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
