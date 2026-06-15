import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Play, Check, ChevronLeft, Camera, ShieldCheck, MapPin, Trophy, Users, Zap, Calendar, Clock } from "lucide-react";
import { SportEvent, Team, Post } from "../types";

interface OnboardingProps {
  onComplete: (data: {
    name: string;
    sports: string[];
    ratings: Record<string, string>;
    competeScope: string;
    timeSlot: string;
    days: string[];
  }) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0); // 0: Landing, 1: Sports, 2: Skills, 3: Profile Details

  // Sports multi-select
  const [selectedSports, setSelectedSports] = useState<string[]>(["Football", "Basketball"]);
  
  // Skill ratings
  const [ratings, setRatings] = useState<Record<string, string>>({
    Football: "Intermediate",
    Basketball: "Amateur",
    Badminton: "Amateur",
    Cricket: "Amateur"
  });

  // Profile Details
  const [name, setName] = useState("");
  const [competeScope, setCompeteScope] = useState("College");
  const [timeSlot, setTimeSlot] = useState("6 PM - 7 PM");
  const [selectedDays, setSelectedDays] = useState<string[]>(["Wed", "Fri", "Sat"]);

  const sportsList = [
    { name: "Cricket", img: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500&q=80", logo: "🏏" },
    { name: "Football", img: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&q=80", logo: "⚽" },
    { name: "Basketball", img: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&q=80", logo: "🏀" },
    { name: "Badminton", img: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=500&q=80", logo: "🏸" }
  ];

  const ratingLevels = ["Novice", "Amateur", "Intermediate", "Advanced"];

  const handleNext = () => {
    if (step === 3) {
      onComplete({
        name: name || "Hemant Agarwal",
        sports: selectedSports,
        ratings,
        competeScope,
        timeSlot,
        days: selectedDays
      });
    } else {
      setStep((prev) => (prev + 1) as any);
    }
  };

  const handleBack = () => {
    setStep((prev) => (prev - 1) as any);
  };

  const toggleSport = (sport: string) => {
    setSelectedSports((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]
    );
  };

  const cycleRating = (sport: string, index: number) => {
    const nextRating = ratingLevels[index];
    setRatings((prev) => ({ ...prev, [sport]: nextRating }));
  };

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="min-h-screen bg-[#050507] text-white flex flex-col relative overflow-hidden select-none max-w-md mx-auto border-x border-white/5 shadow-2xl">
      
      {/* STEP 0: LANDING SCREEN */}
      {step === 0 && (
        <div className="flex-1 flex flex-col justify-between py-8 px-6 relative overflow-hidden">
          {/* Landing Background layers */}
          <div className="absolute inset-0 z-0 opacity-25">
            <img
              src="https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80"
              alt="sports crowd athletes"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/80 to-transparent" />
          </div>

          <div className="z-10 flex justify-between items-center">
            <span className="text-3xl font-black tracking-tighter text-brand font-display">ZIVA</span>
            <button onClick={handleNext} className="text-xs font-bold tracking-widest text-white hover:text-brand border-b border-brand pb-0.5 uppercase">
              Sign In
            </button>
          </div>

          <div className="z-10 text-center space-y-6 my-auto pt-16">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-brand/20 bg-brand/5 text-[10px] font-bold text-brand uppercase tracking-widest">
              <Zap size={10} className="animate-pulse" />
              <span>Activity Engine</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl font-black font-display tracking-tight leading-none italic uppercase">
                Let The Game <br />
                <span className="text-brand">Come To You</span>
              </h1>
              <p className="text-gray-400 text-sm max-w-[280px] mx-auto font-medium">
                Real players. Real tournaments. Real competition.
              </p>
            </div>

            <div className="space-y-3 pt-4">
              <button
                onClick={handleNext}
                className="w-full bg-brand text-black font-bold h-14 rounded-2xl flex items-center justify-center gap-2 text-sm hover:scale-[1.02] active:scale-[0.99] transition-all hover:bg-brand-neon"
              >
                <span>GET STARTED</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={handleNext}
                className="w-full bg-white/5 border border-white/10 text-white font-semibold h-14 rounded-2xl flex items-center justify-center gap-2 text-sm hover:bg-white/10 transition-all"
              >
                <span>WATCH THE MOMENTS</span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                  <Play size={10} className="fill-white translate-x-0.5" />
                </span>
              </button>
            </div>
          </div>

          {/* Lower Key features pillars */}
          <div className="z-10 grid grid-cols-3 gap-2 border-t border-white/5 pt-6 text-[10px] text-gray-500">
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-white">
                <Trophy size={12} className="text-brand" />
                <span className="font-bold">Tournaments</span>
              </div>
              <p className="leading-tight text-gray-500">Campus. City. You.</p>
            </div>
            <div className="space-y-1 border-x border-white/5 px-2">
              <div className="flex items-center gap-1 text-xs text-white">
                <Users size={12} className="text-brand" />
                <span className="font-bold">Players</span>
              </div>
              <p className="leading-tight text-gray-500">Discover. Compete.</p>
            </div>
            <div className="space-y-1 pl-1">
              <div className="flex items-center gap-1 text-xs text-white">
                <Zap size={12} className="text-brand" />
                <span className="font-bold">Competes</span>
              </div>
              <p className="leading-tight text-gray-500">Level up stats.</p>
            </div>
          </div>
        </div>
      )}


      {/* STEP 1: CHOOSE SPORTS */}
      {step === 1 && (
        <div className="flex-1 flex flex-col justify-between py-6 px-6">
          <div className="space-y-5">
            {/* Steps tracker breadcrumb header */}
            <div className="flex justify-between items-center">
              <button onClick={handleBack} className="p-2 -ml-2 text-gray-400 hover:text-white">
                <ChevronLeft size={20} />
              </button>
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Step 1 of 3</span>
                <div className="flex items-center gap-1 w-24 h-1 rounded-full bg-white/10 overflow-hidden">
                  <div className="w-1/3 h-full bg-brand" />
                </div>
              </div>
              <button onClick={handleNext} className="text-xs font-semibold text-gray-400 hover:text-white uppercase tracking-widest">
                Skip
              </button>
            </div>

            <div className="space-y-1.5">
              <h2 className="text-3xl font-extrabold font-display leading-none uppercase italic">
                Choose Your <br />
                <span className="text-brand">Sports</span>
              </h2>
              <div className="h-0.5 w-16 bg-brand" />
              <p className="text-gray-400 text-xs py-1">
                Select the sports you play or follow. We'll tailor your experience based on your favorites.
              </p>
            </div>

            {/* Sports cards bento grid */}
            <div className="grid grid-cols-2 gap-3.5">
              {sportsList.map((sport) => {
                const isSelected = selectedSports.includes(sport.name);
                return (
                  <button
                    key={sport.name}
                    onClick={() => toggleSport(sport.name)}
                    className={`relative rounded-2xl overflow-hidden aspect-[4/3] text-left border transition-all ${
                      isSelected
                        ? "border-brand shadow-lg shadow-brand/10 scale-[1.01]"
                        : "border-white/5 hover:border-white/15"
                    }`}
                  >
                    <img
                      src={sport.img}
                      alt={sport.name}
                      className="absolute inset-0 w-full h-full object-cover opacity-60 hover:opacity-75 transition-all"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    
                    {/* Check marker info indicator */}
                    <div className="absolute top-2.5 right-2.5 h-6 w-6 rounded-full flex items-center justify-center border border-white/20">
                      {isSelected ? (
                        <div className="h-4.5 w-4.5 rounded-full bg-brand flex items-center justify-center text-black">
                          <Check size={10} className="stroke-[3]" />
                        </div>
                      ) : (
                        <div className="h-3 w-3 rounded-full bg-black/40" />
                      )}
                    </div>

                    <div className="absolute bottom-3.5 left-3.5 flex items-center gap-1.5">
                      <span className="text-lg">{sport.logo}</span>
                      <span className="text-sm font-bold text-white uppercase tracking-wide">{sport.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Chips block showing active choices */}
            {selectedSports.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-[10px] uppercase tracking-wider font-bold text-brand block">You've Selected</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSports.map((s) => (
                    <span
                      key={s}
                      onClick={() => toggleSport(s)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#121217] border border-white/5 text-xs font-semibold rounded-full cursor-pointer hover:border-red-500/20 hover:text-red-400 transition-all"
                    >
                      <span>{s === "Cricket" ? "🏏" : s === "Football" ? "⚽" : s === "Basketball" ? "🏀" : "🏸"}</span>
                      <span>{s}</span>
                      <span className="text-[10px] opacity-60">×</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleNext}
            disabled={selectedSports.length === 0}
            className="w-full bg-brand disabled:opacity-50 text-black font-bold h-14 rounded-2xl flex items-center justify-center gap-2 text-sm hover:scale-[1.01] transition-all my-4 hover:bg-brand-neon"
          >
            <span>NEXT: SKILL LEVEL</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}


      {/* STEP 2: RATE SPORTS SKILLS */}
      {step === 2 && (
        <div className="flex-1 flex flex-col justify-between py-6 px-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <button onClick={handleBack} className="p-2 -ml-2 text-gray-400 hover:text-white">
                <ChevronLeft size={20} />
              </button>
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Step 2 of 3</span>
                <div className="flex items-center gap-1 w-24 h-1 rounded-full bg-white/10 overflow-hidden">
                  <div className="w-2/3 h-full bg-brand" />
                </div>
              </div>
              <button onClick={handleNext} className="text-xs font-semibold text-gray-400 hover:text-white uppercase tracking-widest">
                Skip
              </button>
            </div>

            <div className="space-y-1.5">
              <h2 className="text-3xl font-extrabold font-display leading-none uppercase italic">
                Rate Your <br />
                <span className="text-brand">Skills</span>
              </h2>
              <div className="h-0.5 w-16 bg-brand" />
              <p className="text-gray-400 text-xs py-1">
                Precision defines the athlete. Help us match you with players of your caliber.
              </p>
            </div>

            {/* Skiller modules for chosen sports */}
            <div className="space-y-4">
              {selectedSports.map((sport) => {
                const curRating = ratings[sport] || "Amateur";
                const activeIndex = ratingLevels.indexOf(curRating);
                return (
                  <div key={sport} className="bg-[#121217] p-5 rounded-2xl border border-white/5 space-y-4 relative overflow-hidden">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">
                          {sport === "Cricket" ? "🏏" : sport === "Football" ? "⚽" : sport === "Basketball" ? "🏀" : "🏸"}
                        </span>
                        <h4 className="font-bold text-sm tracking-wide text-white uppercase">{sport}</h4>
                      </div>
                      <span className="text-xs font-semibold text-brand bg-brand/5 border border-brand/20 px-2.5 py-0.5 rounded-full">
                        {curRating}
                      </span>
                    </div>

                    {/* Description based on rank level */}
                    <p className="text-[11px] text-gray-400 font-medium">
                      {curRating === "Novice" 
                        ? "Just starting out. Looking to learn basic handles and rules."
                        : curRating === "Amateur"
                        ? "I've played it a couple of times but it is casual."
                        : curRating === "Intermediate"
                        ? "Been there, done that. I know my positions and can hold a solid rally."
                        : "High intensity competitive game. I master tricky smashes and tactical spins."}
                    </p>

                    {/* Interactive Selector timeline slider */}
                    <div className="relative pt-2 pb-1.5">
                      <div className="h-1 bg-white/10 rounded-full w-full relative">
                        {/* Selected fill progress indicator */}
                        <div
                          className="absolute h-full bg-brand rounded-full transition-all duration-300"
                          style={{ width: `${(activeIndex / (ratingLevels.length - 1)) * 100}%` }}
                        />
                      </div>
                      
                      <div className="absolute top-1 flex justify-between w-full -translate-y-[1.5px]">
                        {ratingLevels.map((_, dotIdx) => (
                          <button
                            key={dotIdx}
                            onClick={() => cycleRating(sport, dotIdx)}
                            className={`h-2.5 w-2.5 rounded-full border transition-all ${
                              dotIdx <= activeIndex
                                ? "bg-brand border-brand scale-125"
                                : "bg-black border-white/20 hover:border-brand/45"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Scale markers labels */}
                    <div className="flex justify-between text-[8px] uppercase tracking-widest text-gray-500 font-mono">
                      <span>Novice</span>
                      <span>Amateur</span>
                      <span>Inter</span>
                      <span>Pro</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-medium justify-center">
              <ShieldCheck size={12} className="text-gray-400" />
              <span>You can change this anytime in your profile settings.</span>
            </div>
            
            <button
              onClick={handleNext}
              className="w-full bg-brand text-black font-bold h-14 rounded-2xl flex items-center justify-center gap-2 text-sm hover:scale-[1.01] transition-all hover:bg-brand-neon"
            >
              <span>NEXT: FINAL DETAILS</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}


      {/* STEP 3: FINAL DETAILS PROFILE BUILDER */}
      {step === 3 && (
        <div className="flex-1 flex flex-col justify-between py-6 px-6 relative">
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <button onClick={handleBack} className="p-2 -ml-2 text-gray-400 hover:text-white">
                <ChevronLeft size={20} />
              </button>
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Step 3 of 3</span>
                <div className="flex items-center gap-1 w-24 h-1 rounded-full bg-white/10 overflow-hidden">
                  <div className="w-full h-full bg-brand" />
                </div>
              </div>
              <button onClick={handleNext} className="text-xs font-semibold text-gray-400 hover:text-white uppercase tracking-widest">
                Skip
              </button>
            </div>

            <div className="space-y-1">
              <h2 className="text-3xl font-extrabold font-display leading-none uppercase italic">
                Final <span className="text-brand-purple">Details</span>
              </h2>
              <p className="text-gray-400 text-xs">Build your custom athlete identity.</p>
            </div>

            {/* Glowing circular avatar setup matches Page 4 */}
            <div className="flex flex-col items-center py-2 relative">
              <div className="relative">
                <div className="h-28 w-28 rounded-full border-2 border-brand-purple p-1.5 bg-gradient-to-tr from-[#121217] to-brand-purple/20 flex items-center justify-center relative shadow-lg shadow-brand-purple/25">
                  <div className="h-full w-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80"
                      alt="athlete portrait placeholder"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <button className="absolute bottom-0 right-0 h-8 w-8 bg-brand-purple text-white border border-black rounded-full flex items-center justify-center hover:scale-115 transition-all">
                    <Camera size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Custom fields form inputs */}
            <div className="space-y-3 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase text-gray-400 tracking-wider font-bold">Your Preferred Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name... e.g., Hemant Agarwal"
                  className="w-full h-12 bg-[#121217] border border-white/10 rounded-xl px-4 text-xs text-white uppercase tracking-wider focus:outline-none focus:border-brand-purple transition-all"
                />
              </div>

              {/* Compete setting matrix */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase text-gray-400 tracking-wider font-bold block mb-1">Compete setting</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: "College", logo: "🎓" },
                    { id: "School", logo: "🎒" },
                    { id: "Society", logo: "🏘️" },
                    { id: "Street", logo: "🏀" }
                  ].map((comp) => {
                    const isSelected = competeScope === comp.id;
                    return (
                      <button
                        key={comp.id}
                        type="button"
                        onClick={() => setCompeteScope(comp.id)}
                        className={`h-16 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                          isSelected
                            ? "bg-[#121217] border-brand text-brand font-bold shadow-md shadow-brand/5"
                            : "bg-[#121217]/40 border-white/5 text-gray-400 hover:border-white/15"
                        }`}
                      >
                        <span className="text-sm">{comp.logo}</span>
                        <span className="text-[9px] uppercase tracking-wide">{comp.id}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ideal hours slot */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase text-gray-400 tracking-wider font-bold block mb-1">Preferred Game Hours</label>
                <div className="grid grid-cols-3 gap-2">
                  {["4 PM - 5 PM", "5 PM - 6 PM", "6 PM - 7 PM"].map((slot) => {
                    const isSelected = timeSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTimeSlot(slot)}
                        className={`py-2 px-1 rounded-lg border text-[10px] font-bold text-center transition-all ${
                          isSelected
                            ? "border-brand bg-brand/5 text-brand"
                            : "border-white/5 text-gray-400 bg-black"
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Days setting */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase text-gray-400 tracking-wider font-bold block mb-1">Target Training Days</label>
                <div className="flex justify-between">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
                    const isSelected = selectedDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`h-8 w-11 rounded-lg border text-[10px] font-bold flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-brand border-brand text-black font-extrabold"
                            : "bg-black border-white/5 text-gray-400 hover:border-white/15"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <button
              onClick={handleNext}
              className="w-full bg-brand text-black font-extrabold h-14 rounded-2xl flex items-center justify-center gap-2 text-sm hover:scale-[1.01] hover:bg-brand-neon transition-all shadow-lg"
            >
              <span>CREATE MY IDENTITY 🚀</span>
            </button>
            <p className="text-[9px] text-gray-500 text-center leading-normal">
              By creating a profile you agree to the Athletes' <span className="text-brand-purple underline cursor-pointer">Terms of Service</span>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
