import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Send, Sparkles, MessageCircle, AlertCircle, TrendingUp, Compass, Award, Shield, ThumbsUp } from "lucide-react";

export default function MatchStats() {
  const [activeTab, setActiveTab] = useState<"overview" | "shots" | "movement" | "risk" | "coach">("overview");

  // Coach communication states
  const [messages, setMessages] = useState<any[]>([
    {
      role: "assistant",
      text: "Hey Hemant! I've loaded your match diagnostics against Rahul. Your wrist release was snappy but shoulder load is reaching threshold strain. How can I optimize your workout setup tomorrow?"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendCoachMessage = async (customPrompt?: string) => {
    const promptToSend = customPrompt || inputText;
    if (!promptToSend.trim() || isSending) return;

    const userMsg = { role: "user", text: promptToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsSending(true);

    try {
      const res = await fetch("/api/gemini/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: promptToSend,
          history: messages,
          stats: {
            overallRating: 84,
            winRate: "68%",
            consistency: "79%",
            courtCoverage: "84%",
            injuryRisk: "Right Shoulder: 68%, Lower Back: 62%"
          }
        })
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", text: data.text }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Let's work on stretching your shoulder extensor muscles. I recommend 3 sets of door-frame stretches for 30s. This reduces local strain risk index by another 12%."
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  // Pre-configured tags for quick coach instructions
  const suggestedPrompts = [
    "Shoulder recovery routine?",
    "Improve match footwork speed?",
    "Strategic serve placements?"
  ];

  return (
    <div className="bg-[#050508] p-4 rounded-3xl border border-white/5 space-y-6">
      {/* Selector Tabs matching Page 52-57 horizontal status layout */}
      <div className="flex bg-[#121217] p-1 rounded-xl border border-white/5 overflow-x-auto no-scrollbar">
        {[
          { id: "overview", label: "Overview" },
          { id: "shots", label: "Shots" },
          { id: "movement", label: "Movement" },
          { id: "risk", label: "Injury Risk" },
          { id: "coach", label: "AI Coach" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-shrink-0 flex-1 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === tab.id
                ? "bg-brand text-black font-bold"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* RENDER ACTIVE TAB */}

      {/* OVERVIEW PANEL - Page 51, 52 */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          <div className="bg-[#121217] p-5 rounded-2xl border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-gray-400 text-xs font-medium tracking-widest block mb-1 uppercase">Overall Rating</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold font-display text-white">84</span>
                  <span className="text-brand text-xs font-semibold">▲ 3 from last month</span>
                </div>
              </div>
              <div className="h-14 w-14 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center">
                <span className="text-2xl font-extrabold font-display text-brand">12</span>
              </div>
            </div>

            {/* Sparkline Stats Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-[#050508] p-3.5 rounded-xl border border-white/[0.04]">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Win Rate</div>
                <div className="text-xl font-bold font-mono text-green-400">68%</div>
                <div className="text-[9px] text-gray-400 mt-1">▲ 5% vs last month</div>
              </div>
              <div className="bg-[#050508] p-3.5 rounded-xl border border-white/[0.04]">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Consistency</div>
                <div className="text-xl font-bold font-mono text-purple-400">79%</div>
                <div className="text-[9px] text-gray-400 mt-1">▲ 4% vs last month</div>
              </div>
              <div className="bg-[#050508] p-3.5 rounded-xl border border-white/[0.04]">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Court Coverage</div>
                <div className="text-xl font-bold font-mono text-blue-400">84%</div>
                <div className="text-[9px] text-gray-400 mt-1">▲ 6% vs last month</div>
              </div>
              <div className="bg-[#050508] p-3.5 rounded-xl border border-white/[0.04]">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Reaction Speed</div>
                <div className="text-xl font-bold font-mono text-amber-400">82%</div>
                <div className="text-[9px] text-gray-400 mt-1">▲ 3% vs last month</div>
              </div>
            </div>
          </div>

          {/* Match Win summary badge */}
          <div className="bg-[#121217] p-5 rounded-2xl border border-white/5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-emerald-500/15 text-emerald-400 rounded-lg text-xs font-bold font-mono">W</span>
                <div>
                  <h4 className="text-sm font-bold text-white">Match vs Rahul</h4>
                  <p className="text-[10px] text-gray-400 font-mono">24 May, 2025 • Completed</p>
                </div>
              </div>
              <span className="text-xs font-semibold bg-brand/10 text-brand px-2.5 py-0.5 rounded-full border border-brand/20">Winner</span>
            </div>

            <div className="flex justify-between items-center bg-[#07070a] p-4 rounded-xl border border-white/[0.02]">
              <div>
                <span className="text-[10px] uppercase text-gray-400 font-mono tracking-widest block mb-0.5">Match performance score</span>
                <span className="text-3xl font-extrabold text-white font-mono leading-none">21-18, 21-16</span>
              </div>
              <Award className="text-brand w-8 h-8" />
            </div>

            {/* Quick Metrics columns */}
            <div className="grid grid-cols-4 gap-2 text-center pt-1">
              <div className="bg-[#050508] p-2.5 rounded-lg border border-white/[0.03]">
                <span className="text-[9px] text-gray-500 block">Points</span>
                <span className="text-sm font-bold text-white font-mono">42/72</span>
              </div>
              <div className="bg-[#050508] p-2.5 rounded-lg border border-white/[0.03]">
                <span className="text-[9px] text-gray-500 block">Rally Win</span>
                <span className="text-sm font-bold text-green-400 font-mono">55%</span>
              </div>
              <div className="bg-[#050508] p-2.5 rounded-lg border border-white/[0.03]">
                <span className="text-[9px] text-gray-500 block">Longest</span>
                <span className="text-sm font-bold text-purple-400 font-mono">31</span>
              </div>
              <div className="bg-[#050508] p-2.5 rounded-lg border border-white/[0.03]">
                <span className="text-[9px] text-gray-500 block">Sets</span>
                <span className="text-sm font-bold text-brand font-mono">2</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SHOT ANALYTICS - Page 53 */}
      {activeTab === "shots" && (
        <div className="bg-[#121217] p-5 rounded-2xl border border-white/5 space-y-5">
          <div>
            <h4 className="text-base font-extrabold font-display text-white uppercase tracking-wider">Shot Analytics</h4>
            <p className="text-xs text-gray-400">Accuracy & Success profile analysis across court types.</p>
          </div>

          <div className="space-y-4">
            {[
              { label: "Smash Success", val: 61, color: "bg-brand" },
              { label: "Drop Accuracy", val: 78, color: "bg-brand-purple" },
              { label: "Clear Accuracy", val: 92, color: "bg-green-400" },
              { label: "Net Success", val: 88, color: "bg-blue-400" },
              { label: "Lift Success", val: 91, color: "bg-amber-400" }
            ].map((shot, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-gray-300">{shot.label}</span>
                  <span className="font-bold text-white font-mono">{shot.val}%</span>
                </div>
                <div className="h-1.5 bg-[#050508] rounded-full overflow-hidden border border-white/[0.02]">
                  <div className={`h-full ${shot.color} rounded-full`} style={{ width: `${shot.val}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-white/5 flex justify-between items-center text-xs text-gray-400">
            <span>Unforced Errors Metric</span>
            <span className="font-mono text-red-400 font-bold bg-red-500/10 px-2.5 py-0.5 rounded-full border border-red-500/20">11 Total</span>
          </div>
        </div>
      )}

      {/* MOVEMENT ANALYTICS & HEATMAP - Page 54 */}
      {activeTab === "movement" && (
        <div className="bg-[#121217] p-5 rounded-2xl border border-white/5 space-y-5">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-base font-extrabold font-display text-white uppercase tracking-wider">Movement Analytics</h4>
              <p className="text-xs text-gray-400">Court Movement &amp; coverage stats.</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-extrabold text-brand font-display">87%</span>
              <span className="text-[10px] block text-gray-500 uppercase tracking-widest">Total Coverage</span>
            </div>
          </div>

          {/* Quick Metrics row */}
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-[#050508] p-3 rounded-xl border border-white/[0.03]">
              <span className="text-[10px] text-gray-400 block mb-1">Distance</span>
              <span className="text-sm font-bold text-white font-mono">3.2 km</span>
            </div>
            <div className="bg-[#050508] p-3 rounded-xl border border-white/[0.03]">
              <span className="text-[10px] text-gray-400 block mb-1">Directions</span>
              <span className="text-sm font-bold text-white font-mono">341</span>
            </div>
            <div className="bg-[#050508] p-3 rounded-xl border border-white/[0.03]">
              <span className="text-[10px] text-gray-400 block mb-1">Jump Count</span>
              <span className="text-sm font-bold text-white font-mono">72</span>
            </div>
            <div className="bg-[#050508] p-3 rounded-xl border border-white/[0.03]">
              <span className="text-[10px] text-gray-400 block mb-1">Recovery</span>
              <span className="text-sm font-bold text-white font-mono">0.82 s</span>
            </div>
          </div>

          {/* Court Heatmap render box matches Page 54 exactly */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Court Coverage Thermal Heatmap</label>
            <div className="relative h-44 bg-[#0a0a0f] border-2 border-white/10 rounded-xl overflow-hidden flex items-center justify-center p-3">
              {/* Grid drawing for sports court */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-15 pointer-events-none">
                <div className="border border-white" />
                <div className="border border-white" />
                <div className="border border-white" />
                <div className="border border-white" />
                <div className="border border-white" />
                <div className="border border-white" />
                <div className="border border-white" />
                <div className="border border-white" />
                <div className="border border-white" />
              </div>
              <div className="absolute inset-y-0 left-1/2 w-0.5 bg-white/30" />
              <div className="absolute inset-x-0 top-1/2 h-0.5 bg-white/30" />
              
              {/* Heat spots (visual overlays representing left/right extreme bounds) */}
              <div className="absolute left-[10%] top-[20%] w-14 h-24 rounded-full bg-gradient-radial from-red-500 via-yellow-400 to-transparent opacity-65 blur-md" />
              <div className="absolute right-[10%] top-[40%] w-16 h-20 rounded-full bg-gradient-radial from-red-500 via-yellow-500 to-transparent opacity-65 blur-md" />
              <div className="absolute right-[15%] bottom-[10%] w-12 h-14 rounded-full bg-gradient-radial from-red-600 via-yellow-400 to-transparent opacity-50 blur-md" />
              
              <div className="z-10 font-mono text-[9px] uppercase bg-black/60 px-2 py-1 rounded border border-white/10 text-white flex items-center gap-1">
                <Compass size={10} className="text-brand animate-spin" />
                <span>Active Tracking: badminton_coords_live</span>
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex items-center justify-between text-[10px] text-gray-500">
              <span>Low Density</span>
              <div className="h-2 w-32 rounded bg-gradient-to-r from-blue-500 via-yellow-400 to-red-600" />
              <span>High Density</span>
            </div>
          </div>
        </div>
      )}

      {/* INJURY RISK ANALYSIS - Page 56 */}
      {activeTab === "risk" && (
        <div className="bg-[#121217] p-5 rounded-2xl border border-white/5 space-y-5">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-base font-extrabold font-display text-white uppercase tracking-wider">Injury Risk Analysis</h4>
              <p className="text-xs text-gray-400">Load, Stress &amp; recovery insights</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-extrabold text-brand-purple font-display">72%</span>
              <span className="text-[10px] block text-gray-500 uppercase tracking-widest">Recovery status</span>
            </div>
          </div>

          {/* Interactive risk factors list */}
          <div className="space-y-3.5">
            {[
              { part: "Right Shoulder", risk: "68%", text: "Moderate Load - Focus on mobility and local activation stretches.", status: "Moderate", color: "text-amber-400 border-amber-500/20 bg-amber-500/5" },
              { part: "Lower Back", risk: "62%", text: "Elevated Load - Core stability & spinal column decompression recommended.", status: "Elevated", color: "text-red-400 border-red-500/20 bg-red-500/5" },
              { part: "Right Knee", risk: "24%", text: "Low Load - Healthy ligament tension index. Continue normal training.", status: "Healthy", color: "text-green-400 border-green-500/20 bg-green-500/5" },
              { part: "Right Ankle", risk: "18%", text: "Low Load - Fully receptive ground response. Maintain stability.", status: "Healthy", color: "text-green-400 border-green-500/20 bg-green-500/5" }
            ].map((item, idx) => (
              <div key={idx} className={`p-4.5 rounded-xl border ${item.color} space-y-1.5`}>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-xs uppercase font-display">{item.part}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] tracking-wider uppercase font-semibold">{item.status}</span>
                    <span className="text-sm font-bold font-mono">{item.risk} Risk</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI COACH INTELLIGENT PANEL - Page 57 */}
      {activeTab === "coach" && (
        <div className="space-y-4">
          {/* Main advice display boxes */}
          <div className="bg-[#121217] p-5 rounded-2xl border border-white/5 space-y-4">
            <div className="flex items-center gap-2 text-brand-purple">
              <Sparkles size={18} className="animate-pulse" />
              <h4 className="text-sm font-black font-display uppercase tracking-widest">AI Coach Recommendations</h4>
            </div>

            {/* Chat Thread Messages list */}
            <div className="space-y-3 text-xs max-h-72 overflow-y-auto pr-1 no-scrollbar">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border leading-relaxed space-y-1 ${
                    m.role === "user"
                      ? "bg-[#1f1f28]/60 border-white/10 text-white ml-8"
                      : "bg-[#811ef6]/10 border-brand-purple/20 text-gray-200. border-l-4"
                  }`}
                >
                  <div className="font-bold text-[9px] uppercase tracking-wider text-gray-500 font-mono">
                    {m.role === "user" ? "You" : "ZIVA COACH"}
                  </div>
                  <div>{m.text}</div>
                </div>
              ))}
              {isSending && (
                <div className="flex items-center gap-1.5 p-3 text-gray-500 font-mono font-bold animate-pulse">
                  <Sparkles size={12} className="animate-spin text-brand" />
                  <span>Coach is analyzing biomechanics...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Tap suggested questions list */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Suggested inquiries</span>
              <div className="flex flex-wrap gap-1.5">
                {suggestedPrompts.map((q, idx) => (
                  <button
                    key={idx}
                    disabled={isSending}
                    onClick={() => sendCoachMessage(q)}
                    className="bg-[#050508] border border-white/10 hover:border-brand/40 px-2.5 py-1.5 rounded-lg text-[11px] text-gray-400 hover:text-white transition-all text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* User Text input panel matches screenshots exactly */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendCoachMessage()}
              placeholder="Ask Ziva Coach anything about your game..."
              className="flex-1 bg-[#121217] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-purple transition-all"
            />
            <button
              onClick={() => sendCoachMessage()}
              disabled={isSending || !inputText.trim()}
              className="bg-brand text-black hover:bg-brand-neon p-3 rounded-xl font-bold transition-all disabled:opacity-50"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
