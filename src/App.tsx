import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Home as HomeIcon,
  Compass,
  Users,
  TrendingDown,
  BarChart3,
  PlusCircle,
  Bell,
  MessageSquare,
  Search,
  Filter,
  Plus,
  ArrowRight,
  ShieldAlert,
  ThumbsUp,
  MapPin,
  Trophy,
  CheckCircle,
  Calendar,
  DollarSign,
  ChevronRight,
  Activity,
  Award,
  Zap,
  Volume2,
  Mic,
  Camera,
  Layers,
  Sparkles,
  Share2,
  ArrowLeft,
  Settings,
  Lock,
  LogOut,
  ChevronDown,
  Check,
  Send,
  MoreVertical,
  X,
  CreditCard,
  QrCode,
  Shield,
  Clock
} from "lucide-react";

import { Team, SportEvent, Post, UserProfile, Registration, ClubMember } from "./types";
import Onboarding from "./components/Onboarding";
import BodyVisualizer from "./components/BodyVisualizer";
import MatchStats from "./components/MatchStats";

export default function App() {
  // Main Navigation state
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [activeTab, setActiveTab] = useState<"home" | "explore" | "teams" | "performance" | "messages">("home");
  
  // Overlay Views togglers
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessagesPanel, setShowMessagesPanel] = useState(false);
  const [showCreateOverlay, setShowCreateOverlay] = useState(false);
  
  // Nested Details view states
  const [selectedTournament, setSelectedTournament] = useState<SportEvent | null>(null);
  const [selectedClub, setSelectedClub] = useState<Team | null>(null);
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [activeChat, setActiveChat] = useState<any | null>(null);
  
  // Tournament Registration / Checkout sequence states
  const [regStep, setRegStep] = useState<"none" | "choose_type" | "team_details" | "payment" | "success">("none");
  const [regType, setRegType] = useState<"INDIVIDUAL" | "TEAM">("INDIVIDUAL");
  const [regTeamName, setRegTeamName] = useState("");
  const [regCategory, setRegCategory] = useState("Unspecified");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("upi");

  // Create Wizards flows parameters
  const [createWizardType, setCreateWizardType] = useState<"team" | "event" | "post" | null>(null);
  // Create Team step details
  const [createTeamStep, setCreateTeamStep] = useState(1);
  const [newTeamSport, setNewTeamSport] = useState("Badminton");
  const [newTeamLeague, setNewTeamLeague] = useState("College");
  const [newTeamLocation, setNewTeamLocation] = useState("ISM Dhanbad");
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDesc, setNewTeamDesc] = useState("");
  const [newTeamMembersCount, setNewTeamMembersCount] = useState(6);
  // Create Event step details
  const [createEventStep, setCreateEventStep] = useState(1);
  const [newEventSport, setNewEventSport] = useState("Badminton");
  const [newEventType, setNewEventType] = useState("Tournament");
  const [newEventLocation, setNewEventLocation] = useState("ISM Sports Complex, Indore");
  const [newEventDate, setNewEventDate] = useState("24 May 2025");
  const [newEventFormat, setNewEventFormat] = useState("Doubles");
  const [newEventPrize, setNewEventPrize] = useState("10,000");
  const [posterPrompt, setPosterPrompt] = useState("");
  const [generatedPoster, setGeneratedPoster] = useState<any>({
    title: "Badminton Tournament 25",
    subtitle: "SMASH. COMPETE. CONQUER.",
    dominantColor: "indigo-600",
    accentColor: "yellow-400",
    visualConcept: "A sleek vector silhouette of an athletic badminton player doing an explosive jump smash against golden star sparks.",
    tags: ["Badminton", "ISM", "Tournament"]
  });
  const [isGeneratingPoster, setIsGeneratingPoster] = useState(false);
  // Create Post details
  const [newPostCaption, setNewPostCaption] = useState("");
  const [newPostTags, setNewPostTags] = useState<string[]>(["Badminton", "ISM", "Tournament"]);
  const [newPostAudience, setNewPostAudience] = useState("Club Members");

  // Dynamic user context loaded after onboarding
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Hemant Agarwal",
    level: 12,
    xp: 2450,
    maxXp: 3000,
    club: "Ashiyana Club",
    sport: "Cricket"
  });

  // Local server storage proxy persistence values loaded from backend
  const [store, setStore] = useState<{ teams: Team[]; events: SportEvent[]; posts: Post[]; registrations: Registration[] }>({
    teams: [],
    events: [],
    posts: [],
    registrations: []
  });

  // Load persistence store
  const loadStore = async () => {
    try {
      const res = await fetch("/api/store");
      const data = await res.json();
      setStore(data);
    } catch (e) {
      console.warn("Could not load backend store, using fallbacks");
    }
  };

  useEffect(() => {
    loadStore();
  }, []);

  const handleOnboardingComplete = (data: any) => {
    setUserProfile({
      name: data.name,
      level: 12,
      xp: 2450,
      maxXp: 3000,
      club: data.competeScope === "College" ? "ISM Club" : "Ashiyana Club",
      sport: data.sports[0] || "Badminton"
    });
    setIsOnboarded(true);
    setActiveTab("home");
  };

  // Perform quick Likes increments on posts (Liking toggles Heat counts)
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const toggleLikePost = (postId: string) => {
    setLikedPosts((prev) => {
      const isLiked = prev.includes(postId);
      setStore((s) => ({
        ...s,
        posts: s.posts.map((p) => {
          if (p.id === postId) {
            return { ...p, heat: isLiked ? Number((p.heat - 0.1).toFixed(1)) : Number((p.heat + 0.1).toFixed(1)) };
          }
          return p;
        })
      }));
      return isLiked ? prev.filter((id) => id !== postId) : [...prev, postId];
    });
  };

  // Perform Suggested Clubs interactive Joins
  const [joinedClubs, setJoinedClubs] = useState<string[]>([]);
  const toggleJoinClub = (clubName: string) => {
    setJoinedClubs((prev) =>
      prev.includes(clubName) ? prev.filter((n) => n !== clubName) : [...prev, clubName]
    );
  };

  // Soundwave toggles for voice note playbacks inside feed
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  // Suggested Clubs hardcoded values
  const suggestedClubsList = [
    { name: "Thunder Strikers", sport: "Cricket", heat: "9.2 Heat", logo: "⚡" },
    { name: "Patna Smashers", sport: "Badminton", heat: "8.7 Heat", logo: "🏸" },
    { name: "Goal Diggers FC", sport: "Football", heat: "9.1 Heat", logo: "⚽" },
    { name: "Street Hoops", sport: "Basketball", heat: "8.6 Heat", logo: "🏀" }
  ];

  // hardcoded mock Chat contacts
  const chatsList = [
    { id: "thunder-strikers", name: "Thunder Strikers", logo: "⚡", caption: "Captain: Great win today! 🔥", unread: 3, time: "9:30 AM", isGroup: true },
    { id: "rahul-sharma", name: "Rahul Sharma", logo: "🧔", caption: "That inning was unbelievable! 💪", unread: 2, time: "9:21 AM", isGroup: false },
    { id: "toastmasters-bihar", name: "Toastmasters Bihar", logo: "🎤", caption: "Ananya: Don't forget tomorrow's match!", unread: 0, time: "Yesterday", isGroup: true },
    { id: "arjun-mehta", name: "Arjun Mehta", logo: "🧤", caption: "Hey are we still up for practice?", unread: 1, time: "Yesterday", isGroup: false }
  ];

  // hardcoded notifications list
  const notificationsList = [
    { title: "Match Result 🔥", text: "Thunder Strikers won against Patna Smashers by 18 runs!", time: "5m ago", type: "event" },
    { title: "Team Update 👥", text: "Practice session is scheduled for tomorrow at 6:30 AM.", time: "25m ago", type: "team" },
    { title: "New Comment 💬", text: "Rahul commented on your post: 'Great innings!'", time: "1h ago", type: "social" },
    { title: "Reward Unlocked 🎉", text: "You earned 100 Ziva Points for completing a challenge.", time: "2h ago", type: "reward" }
  ];

  // Hardcoded Club Members items
  const clubMembersSample: ClubMember[] = [
    { name: "Ziva Malhotra", role: "Forward", jersey: "10", level: 12, status: "Active" },
    { name: "Rohan Mehta", role: "Midfielder", jersey: "07", level: 10, status: "Active" },
    { name: "Arjun Nair", role: "Defender", jersey: "21", level: 9, status: "Active" },
    { name: "Kabir Shah", role: "Goalkeeper", jersey: "01", level: 8, status: "Active" },
    { name: "Vivaan Singh", role: "Midfielder", jersey: "08", level: 7, status: "Active" },
    { name: "Aman Verma", role: "Defender", jersey: "14", level: 6, status: "Active" }
  ];

  // Triggering event poster generator AI endpoint
  const requestAIPoster = async () => {
    if (!posterPrompt.trim()) return;
    setIsGeneratingPoster(true);
    try {
      const res = await fetch("/api/gemini/poster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: posterPrompt })
      });
      const data = await res.json();
      setGeneratedPoster(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingPoster(false);
    }
  };

  // Perform Final Event submission of wizard
  const finalizeEventCreation = async () => {
    try {
      await fetch("/api/store/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: generatedPoster.title,
          sport: newEventSport,
          type: newEventType,
          location: newEventLocation,
          date: newEventDate,
          prizePool: newEventPrize,
          description: generatedPoster.subtitle + " " + generatedPoster.visualConcept
        })
      });
      loadStore();
      setShowCreateOverlay(false);
      setCreateWizardType(null);
      setCreateEventStep(1);
    } catch (e) {
      console.warn("Saving to backend mock failed");
    }
  };

  // Perform Final Team submission of wizard
  const finalizeTeamCreation = async () => {
    try {
      await fetch("/api/store/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTeamName || "Custom Team",
          logo: "🏸",
          sport: newTeamSport,
          league: newTeamLeague,
          location: newTeamLocation,
          description: newTeamDesc || "Generated from ZIVA builder.",
          members: newTeamMembersCount
        })
      });
      loadStore();
      setShowCreateOverlay(false);
      setCreateWizardType(null);
      setCreateTeamStep(1);
    } catch (e) {
      console.error(e);
    }
  };

  // Perform Final Post submission of wizard
  const finalizePostCreation = async () => {
    try {
      await fetch("/api/store/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: userProfile.name,
          sport: userProfile.sport,
          caption: newPostCaption + " " + newPostTags.map(t => `#${t}`).join(" ")
        })
      });
      loadStore();
      setNewPostCaption("");
      setShowCreateOverlay(false);
      setCreateWizardType(null);
    } catch (e) {
      console.error(e);
    }
  };

  // Perform final Tournament step registration & checkout payment
  const executeTournamentRegistration = async () => {
    if (!selectedTournament) return;
    try {
      await fetch("/api/store/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: selectedTournament.id,
          registrationType: regType,
          teamName: regType === "TEAM" ? regTeamName : userProfile.name,
          category: regCategory,
          platformFee: 0,
          totalPrice: selectedTournament.price === "Free" ? 0 : parseFloat(selectedTournament.price.replace(",", ""))
        })
      });
      loadStore();
      setRegStep("success");
    } catch (e) {
      setRegStep("success");
    }
  };

  return (
    <div className="font-sans min-h-screen bg-[#050507] text-white flex justify-center selection:bg-brand selection:text-black">
      
      {/* If onboarding completed of athlete, render full athletic hub */}
      {!isOnboarded ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : (
        <div className="w-full max-w-md bg-[#050508] min-h-screen flex flex-col relative border-x border-white/5 pb-20 overflow-x-hidden shadow-2xl">
          
          {/* TOP PRIMARY STATUS HEADER */}
          <header className="px-5 py-4.5 bg-[#050508] border-b border-white/[0.04] sticky top-0 z-40 flex justify-between items-center backdrop-blur-md bg-opacity-95">
            <div className="flex items-center gap-3">
              {/* Profile avatar - opens Profile page settings drawer */}
              <button
                onClick={() => {
                  setShowProfileDrawer(true);
                  setShowNotifications(false);
                  setShowMessagesPanel(false);
                }}
                className="h-10 w-10 rounded-full overflow-hidden border-2 border-brand-purple hover:border-brand p-0.5 transition-all"
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80"
                  alt="athlete avatar"
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              </button>
              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Welcome athlete</span>
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-sm font-extrabold pb-0.5">{userProfile.name.split(" ")[0]}</span>
                  <span className="text-[9px] font-bold font-mono tracking-wider text-brand px-1 bg-brand/5 border border-brand/20 rounded">LV.{userProfile.level}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Notifications bell button */}
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowMessagesPanel(false);
                  setShowProfileDrawer(false);
                }}
                className={`p-2.5 rounded-xl border relative transition-all ${
                  showNotifications ? "bg-brand text-black border-brand" : "bg-[#121217] text-gray-400 border-white/5 hover:text-white"
                }`}
              >
                <Bell size={16} />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand-purple border border-[#121217]" />
              </button>

              {/* Chat bubble messages button */}
              <button
                onClick={() => {
                  setShowMessagesPanel(!showMessagesPanel);
                  setShowNotifications(false);
                  setShowProfileDrawer(false);
                }}
                className={`p-2.5 rounded-xl border relative transition-all ${
                  showMessagesPanel ? "bg-brand text-black border-brand" : "bg-[#121217] text-gray-400 border-white/5 hover:text-white"
                }`}
              >
                <MessageSquare size={16} />
                <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-brand-purple text-white text-[9px] font-black rounded-full flex items-center justify-center font-mono border border-[#121217]">3</span>
              </button>
            </div>
          </header>


          {/* VIEW SLIDING CONTAINERS */}
          <main className="flex-1 px-4.5 py-4 overflow-y-auto no-scrollbar space-y-6">

            {/* DYNAMIC TAB CONTROLLER */}
            {activeTab === "home" && (
              <div className="space-y-6">
                
                {/* Horizontal Story Carousel Block Page 5 */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Stories</span>
                  <div className="flex items-center gap-3 overflow-x-auto pb-1.5 no-scrollbar">
                    {/* Add own post story */}
                    <div className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer">
                      <div className="h-14 w-14 rounded-full border border-dashed border-gray-500 flex items-center justify-center bg-white/5 hover:bg-white/10 transition-all">
                        <Plus className="text-gray-400" size={18} />
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium font-mono">Your Story</span>
                    </div>

                    {/* Curated Sports Stories */}
                    {[
                      { team: "Thunder Strikers", logo: "⚡", bg: "from-amber-400 to-yellow-500" },
                      { team: "Patna Smashers", logo: "🏸", bg: "from-blue-500 to-indigo-600" },
                      { team: "Bihar Warriors", logo: "⚽", bg: "from-emerald-500 to-green-600" },
                      { team: "Toastmasters", logo: "🎤", bg: "from-pink-500 to-rose-600" }
                    ].map((st, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          const found = store.teams.find(t => t.name.toLowerCase() === st.team.toLowerCase());
                          if (found) setSelectedClub(found);
                        }}
                        className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group"
                      >
                        <div className={`h-14 w-14 rounded-full border-2 border-brand-purple p-0.5 bg-gradient-to-tr ${st.bg} flex items-center justify-center overflow-hidden transition-all group-hover:scale-105`}>
                          <span className="text-xl">{st.logo}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium font-mono truncate max-w-[64px] text-center">{st.team}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main feed list */}
                <div className="space-y-5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Social Feed</span>
                    <span className="text-[10px] text-gray-500">Auto updating • live</span>
                  </div>

                  {store.posts.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 text-xs">
                      No posts on the activity feed yet. Try creating a post!
                    </div>
                  ) : (
                    store.posts.map((post) => {
                      const isLiked = likedPosts.includes(post.id);
                      return (
                        <div key={post.id} className="bg-[#121217] rounded-2xl border border-white/5 overflow-hidden shadow-xl space-y-3.5 pb-4">
                          {/* Post Header */}
                          <div className="flex justify-between items-center px-4 pt-4">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-brand-purple/10 flex items-center justify-center text-lg border border-brand-purple/20">
                                {post.authorLogo || "💪"}
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-extrabold text-xs text-white uppercase">{post.author}</span>
                                  <span className="h-3 w-3 bg-brand text-black font-extrabold text-[8px] rounded-full flex items-center justify-center">✓</span>
                                </div>
                                <span className="text-[9px] text-gray-500 font-mono block">{post.time} ago • {post.sport}</span>
                              </div>
                            </div>
                            <button className="text-gray-400 hover:text-white">
                              <MoreVertical size={16} />
                            </button>
                          </div>

                          {/* Post image context optionally rendered */}
                          {post.image && (
                            <div className="relative aspect-[16/10] overflow-hidden">
                              <img
                                src={post.image}
                                alt="match feed detail"
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          )}

                          {/* Post description text */}
                          <div className="px-4 space-y-4">
                            <p className="text-xs leading-relaxed text-gray-200">{post.caption}</p>

                            {/* Optional voice note wave simulation */}
                            {post.voiceNote && (
                              <div className="bg-[#050508] p-3 rounded-2xl border border-white/5 flex items-center justify-between gap-3">
                                <button
                                  onClick={() => setPlayingVoiceId(playingVoiceId === post.id ? null : post.id)}
                                  className="h-8 w-8 rounded-full bg-brand-purple text-white flex items-center justify-center hover:scale-105 transition-all"
                                >
                                  {playingVoiceId === post.id ? (
                                    <span className="flex items-center gap-0.5">
                                      <span className="h-3 w-0.5 bg-white animate-bounce" style={{ animationDelay: "0s" }} />
                                      <span className="h-3 w-0.5 bg-white animate-bounce" style={{ animationDelay: "0.2s" }} />
                                      <span className="h-3 w-0.5 bg-white animate-bounce" style={{ animationDelay: "0.4s" }} />
                                    </span>
                                  ) : (
                                    <span className="pl-0.5">▶</span>
                                  )}
                                </button>
                                
                                {/* Static wave segments */}
                                <div className="flex-1 flex items-center justify-between h-6 px-2 opacity-65">
                                  {Array.from({ length: 28 }).map((_, waveIdx) => (
                                    <div
                                      key={waveIdx}
                                      className={`w-0.5 bg-brand-purple rounded transition-all ${
                                        playingVoiceId === post.id ? "animate-pulse" : ""
                                      }`}
                                      style={{
                                        height: `${10 + Math.sin(waveIdx * 0.5) * 15}px`,
                                        opacity: waveIdx % 3 === 0 ? 0.3 : 1
                                      }}
                                    />
                                  ))}
                                </div>
                                <span className="text-[10px] text-gray-500 font-mono">0:28</span>
                              </div>
                            )}

                            {/* Feed dynamic interactions action footer */}
                            <div className="flex items-center gap-4 pt-1.5 border-t border-white/[0.04] text-[11px] text-gray-400">
                              <button
                                onClick={() => toggleLikePost(post.id)}
                                className={`flex items-center gap-1.5 transition-all ${isLiked ? "text-brand" : "hover:text-brand"}`}
                              >
                                <span className="text-sm">🔥</span>
                                <span className="font-bold">{post.heat} Heat</span>
                              </button>
                              
                              <button className="flex items-center gap-1.5 hover:text-white">
                                <span className="text-xs">💬</span>
                                <span className="font-semibold">{post.comments.length} Comments</span>
                              </button>
                            </div>

                            {/* Render small comments sample Page 5 */}
                            {post.comments.length > 0 && (
                              <div className="space-y-2 bg-[#050510]/50 p-3 rounded-xl border border-white/[0.02]">
                                {post.comments.map((comment, cId) => (
                                  <div key={cId} className="text-[11px] leading-relaxed">
                                    <span className="font-extrabold text-white mr-1.5">{comment.user}:</span>
                                    <span className="text-gray-300">{comment.text}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Suggested Clubs slider matching Page 5 */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Suggested Clubs</span>
                    <button onClick={() => setActiveTab("explore")} className="text-[10px] text-brand uppercase font-extrabold flex items-center gap-0.5 hover:underline">
                      <span>View All</span>
                      <ChevronRight size={12} />
                    </button>
                  </div>

                  <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                    {suggestedClubsList.map((club) => {
                      const isJoined = joinedClubs.includes(club.name);
                      return (
                        <div
                          key={club.name}
                          className="bg-[#121217] p-4 rounded-xl border border-white/5 flex-shrink-0 w-36 text-center space-y-3.5 relative overflow-hidden flex flex-col justify-between"
                        >
                          <div className="absolute top-2 right-2 flex items-center justify-center h-5 w-5 rounded-full bg-brand/5 border border-brand/20">
                            <span className="text-[10px]">🔥</span>
                          </div>

                          <div className="space-y-1.5 flex-1 flex flex-col items-center justify-center pt-3">
                            <div className="h-11 w-11 rounded-full bg-[#121217]/80 border border-brand/20 flex items-center justify-center text-xl shadow-lg">
                              {club.logo}
                            </div>
                            <div>
                              <h5 className="text-[11px] font-extrabold truncate max-w-[105px] text-white uppercase">{club.name}</h5>
                              <p className="text-[9px] text-gray-500 font-semibold">{club.sport}</p>
                            </div>
                          </div>

                          <button
                            onClick={() => toggleJoinClub(club.name)}
                            className={`w-full py-1.5 rounded-lg text-[10px] font-black transition-all ${
                              isJoined 
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                                : "bg-black border border-white/10 text-brand"
                            }`}
                          >
                            {isJoined ? "Joined ✓" : "Join"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}


            {/* EXPLORE PAGE CONTROLLER - Pages 40, 41, 46 */}
            {activeTab === "explore" && (
              <div className="space-y-5">
                
                {/* Search banner */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-3.5 text-gray-500" size={16} />
                  <input
                    type="text"
                    placeholder="Search clubs, tournaments, arenas..."
                    className="w-full bg-[#121217] border border-white/5 rounded-2xl py-3.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-brand-purple"
                  />
                </div>

                {/* Quick Filters category row */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  {["All", "Cricket", "Football", "Volleyball", "Badminton"].map((sportTag) => (
                    <button
                      key={sportTag}
                      className="px-4 py-2 bg-[#121217] hover:bg-brand hover:text-black border border-white/5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all"
                    >
                      {sportTag}
                    </button>
                  ))}
                </div>

                {/* Master Banners for Cups matches Page 40 */}
                <div className="bg-[#121217] rounded-3xl border border-white/5 p-5 relative overflow-hidden min-h-[160px] flex flex-col justify-between">
                  {/* Atmospheric gradient overlay backgrounds */}
                  <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-35 pointer-events-none">
                    <img
                      src="https://images.unsplash.com/photo-1540747737956-378724044453?w=500&q=80"
                      alt="cup game illustration"
                      className="w-full h-full object-cover rounded-l-full"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="space-y-1 z-10 max-w-[210px]">
                    <span className="text-[10px] text-brand uppercase font-extrabold tracking-widest block bg-brand/5 border border-brand/20 px-2 py-0.5 rounded-full w-max">Active Major</span>
                    <h3 className="text-3xl font-black font-display tracking-tight uppercase leading-none text-white italic">
                      Dmsie <br />
                      <span className="text-brand">Cup 2</span>
                    </h3>
                    <p className="text-[10px] text-gray-400 font-mono uppercase tracking-wider pt-1 flex items-center gap-1">
                      <MapPin size={9} className="text-brand" />
                      <span>Dhanbad • Multi Sport</span>
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      const found = store.events.find(e => e.id === "dmsie-cup");
                      if (found) setSelectedTournament(found);
                    }}
                    className="mt-4 bg-brand text-black font-black text-xs py-2.5 px-5 rounded-xl flex items-center gap-1.5 w-max z-10 hover:bg-brand-neon hover:scale-[1.01] transition-all"
                  >
                    <span>REGISTER NOW</span>
                    <ArrowRight size={12} />
                  </button>
                </div>

                {/* Nearby Tournaments widgets list */}
                <div className="space-y-3.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Nearby Tournaments</span>
                    <span className="text-[9px] text-gray-500 uppercase font-mono">Dhanbad Area</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    {store.events.map((ev) => (
                      <div
                        key={ev.id}
                        onClick={() => setSelectedTournament(ev)}
                        className="bg-[#121217] rounded-2xl border border-white/5 overflow-hidden flex flex-col justify-between hover:border-brand/35 transition-all text-left cursor-pointer group"
                      >
                        <div className="p-4 space-y-2.5">
                          <div className="h-9 w-9 bg-brand-purple/10 border border-brand-purple/20 rounded-xl flex items-center justify-center text-lg shadow-md">
                            {ev.sport === "Badminton" ? "🏸" : "🏆"}
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-white uppercase truncate max-w-[140px] leading-tight group-hover:text-brand transition-all">{ev.title}</h4>
                            <span className="text-[9px] text-gray-400 font-semibold">{ev.sport}</span>
                          </div>
                        </div>

                        <div className="p-3 bg-black/40 border-t border-white/[0.03] flex justify-between items-center">
                          <span className="text-[10px] text-brand-purple font-mono font-bold">₹{ev.price} Fee</span>
                          <span className="text-[9px] text-gray-500 flex items-center gap-0.5 font-mono">
                            <Clock size={8} />
                            <span>{ev.date.split(" ").slice(0, 2).join(" ")}</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggested featured clubs module Page 46 */}
                <div className="pt-2">
                  <div className="bg-[#121217] p-5 rounded-2xl border border-white/5 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-extrabold text-brand-purple uppercase tracking-widest pl-1">Join Code Access</span>
                      <span className="text-[10px] text-gray-500">Fast Join</span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter active sport code..."
                        className="flex-1 bg-black border border-white/5 rounded-xl px-4 text-xs font-mono tracking-widest focus:outline-none focus:border-brand"
                      />
                      <button className="bg-brand text-black font-extrabold px-4 rounded-xl text-xs hover:bg-brand-neon">
                        Go
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}


            {/* TEAMS HUB VIEW CONTROLLER - Page 58 */}
            {activeTab === "teams" && (
              <div className="space-y-5">
                <div className="flex justify-between items-center pb-2 border-b border-white/[0.04]">
                  <div>
                    <h2 className="text-base font-extrabold uppercase tracking-wide">My Teams</h2>
                    <p className="text-[10px] text-gray-400">Manage your active clubs & alliances.</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowCreateOverlay(true);
                      setCreateWizardType("team");
                    }}
                    className="bg-brand-purple/20 text-brand border border-brand-purple/30 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-brand-purple/30 transition-all"
                  >
                    <Plus size={12} />
                    <span>Create Team</span>
                  </button>
                </div>

                {/* List of active teams */}
                <div className="space-y-4">
                  {store.teams.map((team) => (
                    <div
                      key={team.id}
                      onClick={() => setSelectedClub(team)}
                      className="bg-[#121217] p-5 rounded-2xl border border-white/5 hover:border-brand-purple/33 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex gap-3.5">
                          <div className="h-11 w-11 rounded-xl bg-black border border-white/10 flex items-center justify-center text-2xl shadow-lg">
                            {team.logo || "🏆"}
                          </div>
                          <div>
                            <h4 className="text-sm font-extrabold text-white uppercase tracking-wide group-hover:text-brand transition-all flex items-center gap-1.5">
                              <span>{team.name}</span>
                              <span className="h-3.5 w-3.5 bg-brand text-black font-extrabold text-[8px] rounded-full flex items-center justify-center">✓</span>
                            </h4>
                            <span className="text-[10px] uppercase font-bold text-gray-400 font-mono">{team.sport} • {team.league} Alliance</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-gray-500 bg-black/40 px-2 py-0.5 rounded border border-white/[0.03]">{team.members} Members</span>
                      </div>

                      {/* Display sponsor badges */}
                      <div className="pt-3 border-t border-white/[0.03] flex items-center justify-between">
                        <span className="text-[9px] uppercase tracking-wider text-gray-500">Sponsored by</span>
                        <div className="flex items-center gap-2.5">
                          {team.sponsors && team.sponsors.map((sp, idx) => (
                            <span key={idx} className="text-[10px] text-gray-400 font-mono uppercase bg-black/40 px-2 py-0.5 rounded border border-white/5 font-extrabold">
                              {sp}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pending Invites Alert Badge component Page 58 */}
                <div className="bg-brand-purple/10 border-2 border-brand-purple/20 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs text-gray-300">
                    <span className="text-lg">📧</span>
                    <div>
                      <span className="font-bold text-white block">Pending Invite</span>
                      <span className="text-[10px]">Invite code: badminton_elite_match</span>
                    </div>
                  </div>
                  <button className="bg-brand text-black font-black text-[10px] py-1.5 px-3 rounded-lg hover:bg-brand-neon transition-all">
                    Accept Choice
                  </button>
                </div>

              </div>
            )}


            {/* PERFORMANCE INSIGHTS CONTROLLER - Pages 12, 51, 52 */}
            {activeTab === "performance" && (
              <div className="space-y-6">
                
                {/* Visualizer and Match analytics toggle panel */}
                <div className="text-center space-y-1.5">
                  <h2 className="text-xl font-bold uppercase tracking-wide font-display text-white">Performance Diagnostics</h2>
                  <p className="text-xs text-gray-400 max-w-[280px] mx-auto leading-relaxed">
                    Choose interactive wireframe body analysis or stats dashboard.
                  </p>
                </div>

                {/* Diagnostic Panels switcher block */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block pl-1">Body Health Diagnostics</span>
                  <BodyVisualizer />
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block pl-1">Athletic Performance Sparklines</span>
                  <MatchStats />
                </div>

              </div>
            )}

          </main>


          {/* PERSISTENT FLOATING DETAILED TOURNAMENT DISPLAY DRAWER */}
          <AnimatePresence>
            {selectedTournament && (
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="absolute inset-0 bg-[#050508] z-50 flex flex-col justify-between overflow-y-auto no-scrollbar pb-6"
              >
                {/* Header detailed info */}
                <div className="sticky top-0 bg-[#050508]/95 border-b border-white/5 py-4.5 px-5 flex justify-between items-center backdrop-blur-md">
                  <button onClick={() => { setSelectedTournament(null); setRegStep("none"); }} className="text-gray-400 hover:text-white flex items-center gap-1 text-xs">
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>
                  <h3 className="font-extrabold font-display uppercase text-sm tracking-wide text-white">Tournament Overview</h3>
                  <button className="text-gray-400 hover:text-white">
                    <Share2 size={16} />
                  </button>
                </div>

                {regStep === "none" ? (
                  <div className="px-5 py-4 space-y-6 flex-1">
                    {/* Cover art images */}
                    <div className="h-48 rounded-2xl overflow-hidden relative border border-white/5">
                      <img
                        src="https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800&q=80"
                        alt="tournament background cover"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <span className="text-[10px] bg-brand text-black font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">{selectedTournament.sport}</span>
                        <h2 className="text-2xl font-black font-display uppercase tracking-tight text-white italic mt-1">{selectedTournament.title}</h2>
                      </div>
                    </div>

                    {/* Vitals summary cards */}
                    <div className="grid grid-cols-3 gap-2.5">
                      <div className="bg-[#121217] p-3 rounded-xl border border-white/5 text-center">
                        <span className="text-[9px] text-gray-500 block">Entry Fee</span>
                        <span className="text-sm font-extrabold text-brand font-mono">₹{selectedTournament.price}</span>
                      </div>
                      <div className="bg-[#121217] p-3 rounded-xl border border-white/5 text-center">
                        <span className="text-[9px] text-gray-500 block">Prize Pool</span>
                        <span className="text-sm font-extrabold text-white font-mono">₹{selectedTournament.prizePool}</span>
                      </div>
                      <div className="bg-[#121217] p-3 rounded-xl border border-white/5 text-center">
                        <span className="text-[9px] text-gray-500 block">Date</span>
                        <span className="text-[10px] font-bold text-brand-purple truncate block pt-0.5">{selectedTournament.date.split(" ")[0]} {selectedTournament.date.split(" ")[1]}</span>
                      </div>
                    </div>

                    {/* Description details info */}
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Details</span>
                      <p className="text-xs text-gray-400 leading-relaxed bg-[#121217] p-4 rounded-xl border border-white/5">
                        {selectedTournament.description}
                      </p>
                    </div>

                    {/* Rules lists matches Page 44 */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Tournament Guidelines &amp; Setup</span>
                      <div className="bg-[#121217] rounded-xl border border-white/5 divide-y divide-white/[0.03]">
                        {selectedTournament.rules.map((rule, rIdx) => (
                          <div key={rIdx} className="flex justify-between items-center py-3 px-4 text-xs">
                            <span className="font-semibold text-gray-400">{rule.name}</span>
                            <span className="font-mono font-bold text-white uppercase">{rule.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick CTA to move to registration steps */}
                    <button
                      onClick={() => setRegStep("choose_type")}
                      className="w-full bg-brand hover:bg-brand-neon text-black font-extrabold h-14 rounded-xl flex items-center justify-center gap-2 text-sm transition-all shadow-md mt-6"
                    >
                      <span>REGISTER FOR CHAMPIONSHIP</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                ) : regStep === "choose_type" ? (
                  <div className="px-5 py-4 space-y-6 flex-1">
                    <div className="text-center space-y-1.5">
                      <h4 className="text-lg font-bold uppercase tracking-wide">How do you want to participate?</h4>
                      <p className="text-xs text-gray-400">Select solo or team setup registration.</p>
                    </div>

                    <div className="space-y-3.5">
                      <div
                        onClick={() => setRegType("INDIVIDUAL")}
                        className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                          regType === "INDIVIDUAL" ? "bg-[#121217] border-brand" : "bg-[#121217]/40 border-white/5"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">👤</span>
                            <div>
                              <span className="text-sm font-extrabold block text-white uppercase">INDIVIDUAL</span>
                              <span className="text-[10px] text-gray-400">Compete Solo in open brackets matching</span>
                            </div>
                          </div>
                          <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${regType === "INDIVIDUAL" ? "border-brand bg-brand" : "border-gray-500"}`}>
                            {regType === "INDIVIDUAL" && <Check size={12} className="text-black stroke-[3]" />}
                          </div>
                        </div>
                      </div>

                      <div
                        onClick={() => setRegType("TEAM")}
                        className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                          regType === "TEAM" ? "bg-[#121217] border-brand" : "bg-[#121217]/40 border-white/5"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">👥</span>
                            <div>
                              <span className="text-sm font-extrabold block text-white uppercase">TEAM ALLIANCE</span>
                              <span className="text-[10px] text-gray-400">Register squad, split keys and entries</span>
                            </div>
                          </div>
                          <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${regType === "TEAM" ? "border-brand bg-brand" : "border-gray-500"}`}>
                            {regType === "TEAM" && <Check size={12} className="text-black stroke-[3]" />}
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setRegStep(regType === "TEAM" ? "team_details" : "payment")}
                      className="w-full bg-brand text-black font-extrabold h-14 rounded-xl flex items-center justify-center gap-2 text-sm hover:bg-brand-neon transition-all"
                    >
                      <span>CONTINUE STEP</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                ) : regStep === "team_details" ? (
                  <div className="px-5 py-4 space-y-6 flex-1">
                    <div className="text-center space-y-1.5">
                      <h4 className="text-lg font-bold uppercase tracking-wide italic">Create Your Team</h4>
                      <p className="text-xs text-gray-400">Just a few details to get started.</p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase text-gray-400 font-bold tracking-wider block">TEAM NAME</label>
                        <input
                          type="text"
                          value={regTeamName}
                          onChange={(e) => setRegTeamName(e.target.value)}
                          placeholder="Enter team name..."
                          className="w-full h-12 bg-[#121217] border border-white/15 rounded-xl px-4 text-xs text-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase text-gray-400 font-bold tracking-wider block">PLAYING AS (OPTIONAL)</label>
                        <select
                          value={regCategory}
                          onChange={(e) => setRegCategory(e.target.value)}
                          className="w-full h-12 bg-[#121217] border border-white/10 rounded-xl px-4 text-xs text-white"
                        >
                          <option value="Unspecified">Select core category</option>
                          <option value="College Open">College Open Bracket</option>
                          <option value="Corporate League">Corporate League</option>
                          <option value="Street Hustlers">Street Hustlers</option>
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={() => setRegStep("payment")}
                      disabled={!regTeamName.trim()}
                      className="w-full bg-brand disabled:opacity-50 text-black font-extrabold h-14 rounded-xl flex items-center justify-center gap-2 text-sm hover:bg-brand-neon transition-all"
                    >
                      <span>CONTINUE TO CHECKOUT</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                ) : regStep === "payment" ? (
                  <div className="px-5 py-4 space-y-6 flex-1">
                    <div className="text-center space-y-1.5">
                      <h4 className="text-lg font-bold uppercase tracking-wide">PAYMENT CHECKOUT</h4>
                      <p className="text-xs text-gray-400">Secure 128-bit athletic transaction gateway.</p>
                    </div>

                    {/* Price ledger summary Page 45 */}
                    <div className="bg-[#121217] p-5 rounded-2xl border border-white/5 space-y-3">
                      <div className="flex justify-between text-xs border-b border-white/[0.04] pb-3">
                        <span className="text-gray-400">Registration Type</span>
                        <span className="font-bold text-white uppercase">{regType}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Entry Fee</span>
                        <span className="font-mono text-white">₹{selectedTournament.price}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Platform Fee</span>
                        <span className="font-mono text-white">₹0</span>
                      </div>
                      <div className="flex justify-between text-sm py-2.5 border-t border-dashed border-white/10 text-brand">
                        <span className="font-bold text-white">Total Amount</span>
                        <span className="font-extrabold font-mono text-lg">₹{selectedTournament.price}</span>
                      </div>
                    </div>

                    {/* Channel Selector list Page 45 */}
                    <div className="space-y-2.5">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Choose payment method</span>
                      
                      {[
                        { id: "upi", label: "Unified UPI App (Google Pay, Paytm, PhonePe)", description: "Pay securely with instant validation" },
                        { id: "card", label: "Credit / Debit Cards", description: "Visa, Mastercard, RuPay processed" },
                        { id: "net", label: "Net Banking (All Major Banks)", description: "Transfer directly using routing keys" }
                      ].map((pay) => (
                        <div
                          key={pay.id}
                          onClick={() => setSelectedPaymentMethod(pay.id)}
                          className={`p-4 rounded-xl border cursor-pointer flex justify-between items-center transition-all ${
                            selectedPaymentMethod === pay.id ? "bg-[#1f1f28]/60 border-brand" : "bg-[#121217]/50 border-white/5"
                          }`}
                        >
                          <div>
                            <span className="text-xs font-bold block text-white uppercase">{pay.id}</span>
                            <span className="text-[9px] text-gray-400 leading-tight block">{pay.label}</span>
                          </div>
                          <div className={`h-4 w-4 bg-transparent border-2 rounded-full flex items-center justify-center ${selectedPaymentMethod === pay.id ? "border-brand" : "border-gray-500"}`}>
                            {selectedPaymentMethod === pay.id && <div className="h-2 w-2 rounded-full bg-brand" />}
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={executeTournamentRegistration}
                      className="w-full bg-brand text-black font-extrabold h-14 rounded-xl flex items-center justify-center gap-2 text-sm hover:bg-brand-neon transition-all"
                    >
                      <span>PAY ₹{selectedTournament.price} SECURELY</span>
                    </button>
                  </div>
                ) : (
                  <div className="px-5 py-8 space-y-6 flex-1 flex flex-col justify-center items-center text-center">
                    <div className="h-20 w-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-3xl text-emerald-400 animate-bounce">
                      ✓
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black font-display uppercase italic tracking-tight">Team Registered</h3>
                      <span className="text-xs text-brand bg-brand/5 border border-brand/20 px-3 py-1 rounded-full font-semibold">Successfully!</span>
                      <p className="text-xs text-gray-400 max-w-[280px] mx-auto pt-2 leading-relaxed">
                        Your slot is fully confirmed inside {selectedTournament.title}! See you on game day {selectedTournament.date.split(" ")[0]}.
                      </p>
                    </div>

                    <div className="bg-[#121217] p-5. rounded-xl border border-white/5 w-full divide-y divide-white/5">
                      <div className="flex justify-between items-center py-2 px-4 text-xs">
                        <span className="text-gray-400">Registered Name</span>
                        <span className="font-bold text-white">{regType === "TEAM" ? regTeamName : userProfile.name}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 px-4 text-xs">
                        <span className="text-gray-400">Class Pool</span>
                        <span className="font-mono font-semibold text-brand">{regCategory}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => { setSelectedTournament(null); setRegStep("none"); }}
                      className="w-full bg-brand text-black font-extrabold h-14 rounded-xl hover:bg-brand-neon transition-all"
                    >
                      GO TO EXPLORE
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>


          {/* OTHER MODAL OVERLAYS (Chose Profile, Create Wizard triggers, Notifications panels, chats lists) */}
          
          {/* PROFILE / SETTINGS PANEL SIDEBAR DRAW - Page 6 */}
          <AnimatePresence>
            {showProfileDrawer && (
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween" }}
                className="absolute inset-y-0 left-0 right-10 bg-[#0c0c0f] z-50 p-6 flex flex-col justify-between border-r border-white/10 shadow-2xl"
              >
                <div className="space-y-6">
                  {/* Close drawer button header */}
                  <div className="flex justify-between items-center border-b border-white/[0.04] pb-4">
                    <span className="text-xs font-black tracking-widest text-[#cffc02] font-display">ZIVA SPORTS</span>
                    <button onClick={() => setShowProfileDrawer(false)} className="text-gray-400 hover:text-white">
                      <X size={18} />
                    </button>
                  </div>

                  {/* Profile Header detail */}
                  <div className="flex items-center gap-3.5">
                    <div className="h-14 w-14 rounded-full border-2 border-brand-purple p-0.5">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=140&q=80"
                        alt="portrait"
                        className="w-full h-full object-cover rounded-full"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm uppercase text-white leading-normal">{userProfile.name}</h3>
                      <span className="text-[9px] bg-brand-purple/20 text-brand-purple px-2 py-0.5 rounded border border-brand-purple/30 font-extrabold uppercase">Premium Athlete Mode</span>
                    </div>
                  </div>

                  {/* XP Level markers row Page 6 */}
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="font-bold text-white">Level {userProfile.level}</span>
                      <span className="font-mono text-gray-500 font-bold">{userProfile.xp} / {userProfile.maxXp} XP</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/[0.02]">
                      <div className="h-full bg-brand rounded-full" style={{ width: `${(userProfile.xp / userProfile.maxXp) * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-gray-400 block font-medium">550 XP remaining to achieve Level 13</span>
                  </div>

                  {/* QR Entry Pass matching Page 6 exactly */}
                  <div className="bg-[#121217] p-4.5 rounded-2xl border border-white/5 space-y-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 bg-brand/10 border border-brand/20 rounded-xl flex items-center justify-center text-brand">
                        <QrCode size={22} className="animate-pulse" />
                      </div>
                      <div>
                        <span className="text-xs font-bold block text-white uppercase leading-normal">My QR Pass</span>
                        <span className="text-[10px] text-gray-400">Quick entry &amp; check-in at active arenas</span>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-gray-500" />
                  </div>

                  {/* Profile listing action buttons matches exactly Page 6 */}
                  <div className="space-y-1.5 pt-2">
                    {[
                      { icon: "👤", text: "My Profile" },
                      { icon: "🏏", text: "My Sports Grid" },
                      { icon: "📈", text: "Progress Dashboard" },
                      { icon: "🏆", text: "Achievements Hub" },
                      { icon: "🎒", text: "My Gear Inventory" },
                      { icon: "🌟", text: "Premium Membership" }
                    ].map((btn, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-black/40 hover:bg-[#121217] border border-white/5 rounded-xl flex justify-between items-center text-xs transition-all cursor-pointer text-gray-300 hover:text-white"
                      >
                        <span className="flex items-center gap-3">
                          <span className="text-sm">{btn.icon}</span>
                          <span className="font-semibold">{btn.text}</span>
                        </span>
                        <ChevronDown size={12} className="text-gray-500" />
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setIsOnboarded(false)}
                  className="w-full bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-500/20 rounded-xl h-12 flex items-center justify-center gap-2 text-xs font-bold transition-all"
                >
                  <LogOut size={14} />
                  <span>Logout Session</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>


          {/* NOTIFICATIONS DISCLOSURES PANEL OVERLAY - Page 24 */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute left-6 right-6 top-[72px] bg-[#121217] border border-white/10 z-50 rounded-2xl p-4 shadow-2xl space-y-4 max-h-[460px] overflow-y-auto no-scrollbar"
              >
                <div className="flex justify-between items-center border-b border-white/[0.04] pb-2">
                  <span className="text-xs font-extrabold uppercase text-brand tracking-widest pl-1">Live Notifications</span>
                  <button onClick={() => setShowNotifications(false)} className="text-gray-500 hover:text-white">
                    <X size={14} />
                  </button>
                </div>

                <div className="space-y-3.5">
                  {notificationsList.map((not, idx) => (
                    <div key={idx} className="flex gap-3 text-xs leading-normal items-start pb-2 border-b border-white/[0.02]">
                      <span className="text-base pt-0.5">🔔</span>
                      <div className="flex-1">
                        <span className="font-extrabold text-white block uppercase tracking-wide text-[11px]">{not.title}</span>
                        <p className="text-[11px] text-gray-400 mt-0.5">{not.text}</p>
                        <span className="text-[9px] text-gray-500 font-mono block mt-1">{not.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>


          {/* MESSAGES DRAWER DISCLOSURES PANEL - Page 22 */}
          <AnimatePresence>
            {showMessagesPanel && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute left-6 right-6 top-[72px] bg-[#121217] border border-white/10 z-50 rounded-2xl p-4 shadow-2xl space-y-4 max-h-[460px] overflow-y-auto no-scrollbar"
              >
                <div className="flex justify-between items-center border-b border-white/[0.04] pb-2">
                  <span className="text-xs font-extrabold uppercase text-[#cffc02] tracking-widest pl-1">Active Match Chats</span>
                  <button onClick={() => setShowMessagesPanel(false)} className="text-gray-500 hover:text-white">
                    <X size={14} />
                  </button>
                </div>

                <div className="space-y-3">
                  {chatsList.map((chatItem) => (
                    <div
                      key={chatItem.id}
                      onClick={() => {
                        setActiveChat(chatItem);
                        setShowMessagesPanel(false);
                      }}
                      className="p-3 bg-black/30 hover:bg-black/60 border border-white/5 rounded-xl cursor-pointer flex justify-between items-center transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-brand-purple/20 text-white flex items-center justify-center text-sm border border-brand-purple/20">
                          {chatItem.logo}
                        </div>
                        <div>
                          <span className="text-[11px] font-extrabold text-white block leading-tight uppercase tracking-wider">{chatItem.name}</span>
                          <span className="text-[9px] text-gray-500 max-w-[170px] truncate block pt-0.5">{chatItem.caption}</span>
                        </div>
                      </div>
                      <div className="text-right flex flex-col justify-between h-8 items-end">
                        <span className="text-[8px] text-gray-500 font-mono">{chatItem.time}</span>
                        {chatItem.unread > 0 && (
                          <span className="h-4 w-4 bg-brand text-black text-[9px] font-black rounded-full flex items-center justify-center font-mono">
                            {chatItem.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>


          {/* DETAILED ACTIVE CHAT POPUP WINDOW PANEL - Page 23 */}
          <AnimatePresence>
            {activeChat && (
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                className="absolute inset-0 bg-[#050508] z-50 flex flex-col justify-between"
              >
                {/* Chat window Header */}
                <div className="sticky top-0 bg-[#050508] border-b border-white/5 py-4 px-5 flex justify-between items-center">
                  <button onClick={() => setActiveChat(null)} className="text-gray-400 hover:text-white flex items-center gap-1 text-xs">
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>
                  <div className="text-center">
                    <h3 className="font-extrabold text-xs uppercase text-white tracking-wide">{activeChat.name}</h3>
                    <span className="text-[9px] text-brand font-mono font-bold">● Active Match Chat Room</span>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-[#121217] flex items-center justify-center text-sm border border-white/5 text-gray-400">
                    {activeChat.logo}
                  </div>
                </div>

                {/* Simulated conversations thread list matches Page 23 */}
                <div className="flex-1 p-5 overflow-y-auto no-scrollbar space-y-4 text-xs">
                  <div className="text-center text-[10px] text-gray-500 font-mono uppercase bg-black/40 py-1.5 rounded-full max-w-[120px] mx-auto border border-white/[0.02]">
                    Match Room
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <div className="h-7 w-7 rounded-full bg-brand-purple text-xs text-white flex items-center justify-center">🧔</div>
                    <div>
                      <div className="bg-[#121217] p-3 rounded-2xl border border-white/5 rounded-tl-none max-w-[220px]">
                        <span className="font-bold text-[9px] text-brand uppercase block mb-1">Arjun Mehta</span>
                        <p className="text-gray-200">Great win yesterday! Everyone gave their absolute best out there. 💪🔥</p>
                      </div>
                      <span className="text-[8px] text-gray-500 font-mono mt-1 block pl-1">9:15 AM</span>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start justify-end">
                    <div className="text-right">
                      <div className="bg-[#811ef6]/15 border border-brand-purple/20 p-3 rounded-2xl rounded-tr-none text-left max-w-[220px]">
                        <p className="text-gray-200">Thanks team! Our defensive coverage lines were solid and shot finishing was spot on. 🏸</p>
                      </div>
                      <span className="text-[8px] text-gray-500 font-mono mt-1 block pr-1">9:17 AM</span>
                    </div>
                    <div className="h-7 w-7 rounded-full bg-brand text-xs text-black font-extrabold flex items-center justify-center">HA</div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <div className="h-7 w-7 rounded-full bg-brand-purple text-xs text-white flex items-center justify-center">🧔</div>
                    <div>
                      <div className="bg-[#121217] p-3 rounded-2xl border border-white/5 rounded-tl-none max-w-[220px]">
                        <span className="font-bold text-[9px] text-brand uppercase block mb-1">Rahul Sharma</span>
                        <p className="text-gray-200">Special shoutout to Karan for holding down those last 2 rallies. Game changer! 🌟</p>
                      </div>
                      <span className="text-[8px] text-gray-500 font-mono mt-1 block pl-1">9:18 AM</span>
                    </div>
                  </div>
                </div>

                {/* Input text write panel */}
                <div className="p-4 bg-[#0c0c10] border-t border-white/[0.04] flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Message squad members..."
                    className="flex-1 bg-[#121217] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                  />
                  <button className="bg-brand text-black hover:bg-brand-neon p-3 rounded-xl">
                    <Send size={14} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>


          {/* ACTIVE CLUB ENHANCED DETAIL DRAWER PAGE - Pages 47, 48, 50 */}
          <AnimatePresence>
            {selectedClub && (
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="absolute inset-0 bg-[#050508] z-50 flex flex-col justify-between overflow-y-auto no-scrollbar pb-6 text-xs"
              >
                {/* Header matches club pages exactly Page 47 */}
                <div className="sticky top-0 bg-[#050508]/95 border-b border-white/5 py-4.5 px-5 flex justify-between items-center backdrop-blur-md">
                  <button onClick={() => setSelectedClub(null)} className="text-gray-400 hover:text-white flex items-center gap-1 text-xs">
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>
                  <h3 className="font-extrabold font-display uppercase text-sm tracking-wide text-brand-purple">Club Hub</h3>
                  <button className="text-white hover:text-brand">
                    <MoreVertical size={16} />
                  </button>
                </div>

                <div className="px-5 py-4 space-y-6 flex-1">
                  {/* Glowing Club Profile Cover design Page 47 */}
                  <div className="bg-[#121217] p-5 rounded-2xl border border-white/5 space-y-4">
                    <div className="flex gap-4 items-center">
                      <div className="h-16 w-16 bg-black border border-white/10 rounded-xl flex items-center justify-center text-3xl shadow-lg">
                        {selectedClub.logo || "🏆"}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h2 className="text-xl font-extrabold uppercase italic tracking-tight text-white">{selectedClub.name}</h2>
                          <span className="h-3.5 w-3.5 bg-brand text-black font-extrabold text-[8px] rounded-full flex items-center justify-center">✓</span>
                        </div>
                        <span className="text-[10px] text-gray-500 font-semibold uppercase font-mono">{selectedClub.sport} Grid • {selectedClub.members} Active Members</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed bg-black/40 p-3 rounded-xl border border-white/[0.02]">
                      {selectedClub.description}
                    </p>
                  </div>

                  {/* Dynamic sub tabs switcher within the club view */}
                  <div className="space-y-4">
                    {/* Members List matches Page 48 */}
                    <div className="space-y-3">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block pl-1">Squad Members</span>
                      <div className="bg-[#121217] rounded-xl border border-white/5 divide-y divide-white/[0.03]">
                        {clubMembersSample.map((mem, idx) => (
                          <div
                            key={idx}
                            onClick={() => setSelectedMember(mem)}
                            className="flex justify-between items-center py-3.5 px-4 hover:bg-white/[0.02] cursor-pointer transition-all rounded-xl"
                          >
                            <div className="flex items-center gap-3">
                              <span className="p-1 bg-black/50 text-[#cffc02] rounded-lg text-xs font-bold font-mono">#{mem.jersey}</span>
                              <div>
                                <span className="font-extrabold text-sm uppercase text-gray-200. text-white block">{mem.name}</span>
                                <span className="text-[10px] text-gray-400 font-semibold">{mem.role} • 🟢 Active</span>
                              </div>
                            </div>
                            <span className="text-[11px] font-bold text-gray-400 font-mono bg-black px-2.5 py-1 rounded border border-white/15">Lv.{mem.level}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Upcoming schedule block Page 50 */}
                    <div className="space-y-3">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block pl-1">Upcoming matches schedule</span>
                      <div className="bg-[#121217] p-5 rounded-2xl border border-white/5 space-y-4">
                        <div className="flex justify-between items-center border-b border-white/[0.04] pb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-base">🏆</span>
                            <div>
                              <span className="text-xs font-extrabold text-white block uppercase">District Championship 2026</span>
                              <span className="text-[10px] text-brand">Qualified Bracket</span>
                            </div>
                          </div>
                          <span className="text-[9px] text-gray-400 font-mono font-bold font-display">24-28 May</span>
                        </div>

                        <div className="space-y-3 font-mono text-[11px]">
                          <div className="flex justify-between items-center py-1">
                            <span className="font-semibold text-gray-400">Titans FC (League)</span>
                            <span className="text-brand font-bold">25 May @ 7:30 PM</span>
                          </div>
                          <div className="flex justify-between items-center py-1">
                            <span className="font-semibold text-gray-400">Blaze United (League)</span>
                            <span className="text-white">01 Jun @ 6:00 PM</span>
                          </div>
                          <div className="flex justify-between items-center py-1">
                            <span className="font-semibold text-gray-400">Victory FC (League)</span>
                            <span className="text-white">08 Jun @ 7:00 PM</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>


          {/* DETAILED PLAYER PROFILE DRAWER PAGE - Page 49 */}
          <AnimatePresence>
            {selectedMember && (
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="absolute inset-0 bg-[#050508] z-50 flex flex-col justify-between overflow-y-auto no-scrollbar pb-6 text-xs"
              >
                {/* Header Page 49 */}
                <div className="sticky top-0 bg-[#050508]/95 border-b border-white/5 py-4 px-5 flex justify-between items-center backdrop-blur-md">
                  <button onClick={() => setSelectedMember(null)} className="text-gray-400 hover:text-white flex items-center gap-1 text-xs">
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>
                  <h3 className="font-extrabold font-display uppercase text-sm tracking-wide text-brand">Player Profile</h3>
                  <button className="text-white hover:text-brand">
                    <MoreVertical size={16} />
                  </button>
                </div>

                <div className="px-5 py-4 space-y-6 flex-1">
                  {/* Big Hero Player avatar matches Page 49 */}
                  <div className="bg-[#121217] rounded-3xl border border-white/5 overflow-hidden flex flex-col items-center p-6 relative">
                    <span className="absolute top-4 left-4 bg-yellow-500 text-black text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase">Captain</span>
                    
                    <div className="h-32 w-32 rounded-full border-2 border-brand p-1.5 bg-gradient-to-tr from-brand to-brand-purple/20 flex items-center justify-center relative shadow-lg shadow-brand/20">
                      <img
                        src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&q=80"
                        alt="player profile avatar"
                        className="w-full h-full object-cover rounded-full"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="text-center mt-4.5 space-y-1">
                      <h2 className="text-2xl font-black font-display uppercase tracking-tight text-white leading-none mt-1">{selectedMember.name}</h2>
                      <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{selectedMember.role} • Jersey #{selectedMember.jersey}</span>
                      <div className="mt-3.5 flex items-center gap-1.5 justify-center">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider">🟢 Active player</span>
                      </div>
                    </div>
                  </div>

                  {/* Profile Vitals specifications table Page 49 */}
                  <div className="bg-[#121217] p-4.5 rounded-2xl border border-white/5 space-y-3.5">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Athlete specifications</h4>
                    <div className="grid grid-cols-2 gap-3 font-mono text-[11px] leading-tight text-gray-300">
                      <div className="flex justify-between py-1 border-b border-white/[0.02]">
                        <span className="text-gray-500">Joined</span>
                        <span className="font-bold text-white">Jan 2023</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/[0.02]">
                        <span className="text-gray-500">Weight</span>
                        <span className="font-bold text-white">72 kg</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/[0.02]">
                        <span className="text-gray-500">Age</span>
                        <span className="font-bold text-white">25 Years</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/[0.02]">
                        <span className="text-gray-500">Height</span>
                        <span className="font-bold text-white">5' 11\"</span>
                      </div>
                    </div>
                  </div>

                  {/* Performance stats summaries Page 49 */}
                  <div className="bg-[#121217] p-5 rounded-2xl border border-white/5 space-y-4">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block pl-1">Performance overview</span>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      <div className="bg-black/50 p-2.5 rounded-xl border border-white/5">
                        <span className="text-[9px] text-gray-500 block">Matches</span>
                        <span className="text-base font-bold text-white font-mono">32</span>
                      </div>
                      <div className="bg-black/50 p-2.5 rounded-xl border border-white/5">
                        <span className="text-[9px] text-gray-500 block">Goals</span>
                        <span className="text-base font-bold text-brand font-mono">18</span>
                      </div>
                      <div className="bg-black/50 p-2.5 rounded-xl border border-white/5">
                        <span className="text-[9px] text-gray-500 block">Assists</span>
                        <span className="text-base font-bold text-purple-400 font-mono">09</span>
                      </div>
                      <div className="bg-black/50 p-2.5 rounded-xl border border-white/5">
                        <span className="text-[9px] text-gray-500 block">Rating</span>
                        <span className="text-base font-bold text-green-400 font-mono">Lv.12</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>


          {/* PERSISTENT FLOATING BOTTOM CREATORS SHEET OVERLAY - Page 25 */}
          <AnimatePresence>
            {showCreateOverlay && (
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                className="absolute inset-0 bg-[#050510] z-50 flex flex-col justify-between overflow-y-auto no-scrollbar pb-6"
              >
                {/* Header info */}
                <div className="sticky top-0 bg-[#050510]/95 border-b border-white/10 py-4.5 px-5 flex justify-between items-center z-50">
                  <span className="text-xl font-extrabold italic font-display text-brand tracking-widest block uppercase">CREATE HUB</span>
                  <button onClick={() => { setShowCreateOverlay(false); setCreateWizardType(null); }} className="text-gray-400 hover:text-white bg-white/5 p-2 rounded-xl border border-white/5">
                    <X size={16} />
                  </button>
                </div>

                {!createWizardType ? (
                  <div className="px-5 py-4 space-y-5 flex-1 flex flex-col justify-center text-xs">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">What would you like to build?</span>
                    
                    {[
                      { type: "team", title: "CREATE TEAM or ALLIANCE", desc: "Build collegiate, corporate or local squads", icon: "👥" },
                      { type: "event", title: "PUBLISH SPORT EVENT", desc: "Plan Tournaments, Practice or Friendly matches", icon: "🏆" },
                      { type: "post", title: "CREATE ACTIVITY POST", desc: "Share moments, captions and athlete story photos", icon: "📸" }
                    ].map((opt) => (
                      <div
                        key={opt.type}
                        onClick={() => {
                          setCreateWizardType(opt.type as any);
                          setCreateTeamStep(1);
                          setCreateEventStep(1);
                        }}
                        className="bg-[#121217] p-5 rounded-2xl border border-white/5 hover:border-brand transition-all cursor-pointer flex justify-between items-center"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-3xl bg-black h-12 w-12 rounded-xl flex items-center justify-center">{opt.icon}</span>
                          <div>
                            <span className="text-sm font-extrabold text-white block uppercase leading-tight">{opt.title}</span>
                            <span className="text-[10px] text-gray-400">{opt.desc}</span>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-gray-500" />
                      </div>
                    ))}
                  </div>
                ) : createWizardType === "team" ? (
                  <div className="px-5 py-4 space-y-6 flex-1 text-xs">
                    {/* Choose team basics Page 26 */}
                    {createTeamStep === 1 ? (
                      <div className="space-y-6 flex flex-col justify-between h-full">
                        <div className="space-y-4">
                          <div className="text-center">
                            <span className="text-[9px] text-brand uppercase tracking-widest font-bold">Step 1 of 2</span>
                            <h4 className="text-lg font-bold uppercase tracking-tight">Team Basics</h4>
                          </div>

                          <div className="space-y-3">
                            <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Select Sport</label>
                            <div className="grid grid-cols-3 gap-2">
                              {["Badminton", "Cricket", "Football", "Basketball"].map((sp) => (
                                <button
                                  key={sp}
                                  onClick={() => setNewTeamSport(sp)}
                                  className={`py-3 rounded-xl border text-center font-bold font-mono tracking-wide uppercase transition-all ${
                                    newTeamSport === sp ? "border-brand bg-brand/5 text-brand" : "border-white/5 text-gray-400 bg-black/40"
                                  }`}
                                >
                                  {sp}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Select League Type</label>
                            <div className="grid grid-cols-2 gap-2">
                              {["College", "Society", "Street", "Corporate"].map((lg) => (
                                <button
                                  key={lg}
                                  onClick={() => setNewTeamLeague(lg)}
                                  className={`py-3.5 rounded-xl border text-center font-bold uppercase transition-all ${
                                    newTeamLeague === lg ? "border-brand-purple bg-[#121217] text-white" : "border-white/5 text-gray-400 bg-black/20"
                                  }`}
                                >
                                  {lg}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => setCreateTeamStep(2)}
                          className="w-full bg-brand text-black font-extrabold h-14 rounded-xl flex items-center justify-center gap-1 hover:bg-brand-neon transition-all"
                        >
                          <span>CONTINUE STEPS</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        <div className="text-center">
                          <span className="text-[9px] text-brand uppercase tracking-widest font-bold">Step 2 of 2</span>
                          <h4 className="text-lg font-bold uppercase">Team Identity</h4>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">TEAM NAME</label>
                            <input
                              type="text"
                              value={newTeamName}
                              onChange={(e) => setNewTeamName(e.target.value)}
                              placeholder="e.g., Thunder Strikers..."
                              className="w-full h-12 bg-[#121217] border border-white/10 rounded-xl px-4 text-xs"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">TEAM DESCRIPTION</label>
                            <textarea
                              rows={3}
                              value={newTeamDesc}
                              onChange={(e) => setNewTeamDesc(e.target.value)}
                              placeholder="Describe your team custom goal..."
                              className="w-full bg-[#121217] border border-white/10 rounded-xl p-4 text-xs focus:outline-none"
                            />
                          </div>
                        </div>

                        <button
                          onClick={finalizeTeamCreation}
                          disabled={!newTeamName.trim()}
                          className="w-full bg-brand disabled:opacity-50 text-black font-black h-14 rounded-xl flex items-center justify-center transition-all mt-4"
                        >
                          CREATE SQUAD NOW
                        </button>
                      </div>
                    )}
                  </div>
                ) : createWizardType === "event" ? (
                  <div className="px-5 py-4 space-y-6 flex-1 text-xs">
                    {/* Create Event Page 32 */}
                    {createEventStep === 1 ? (
                      <div className="space-y-5">
                        <div className="text-center">
                          <span className="text-[9px] text-brand uppercase tracking-widest font-bold">Step 1 of 3</span>
                          <h4 className="text-lg font-bold uppercase tracking-tight">Event Details</h4>
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] uppercase font-bold text-gray-400">Preferred Sport</label>
                          <select
                            value={newEventSport}
                            onChange={(e) => setNewEventSport(e.target.value)}
                            className="w-full h-12 bg-[#121217] border border-white/10 rounded-xl px-4 text-xs"
                          >
                            <option value="Badminton">Badminton</option>
                            <option value="Cricket">Cricket</option>
                            <option value="Football">Football</option>
                            <option value="Basketball">Basketball</option>
                          </select>
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] uppercase font-bold text-gray-400">Event Type</label>
                          <div className="grid grid-cols-2 gap-2">
                            {["Tournament", "Friendly", "Practice", "Trial"].map((t) => (
                              <button
                                key={t}
                                type="button"
                                onClick={() => setNewEventType(t)}
                                className={`py-3.5 rounded-xl border text-center font-bold uppercase transition-all ${
                                  newEventType === t ? "border-brand bg-brand/5 text-brand" : "border-white/5 text-gray-400 bg-black/20"
                                }`}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => setCreateEventStep(2)}
                          className="w-full bg-brand text-black font-extrabold h-14 rounded-xl flex items-center justify-center gap-1 hover:bg-brand-neon transition-all"
                        >
                          <span>CONTINUE TO EVENT SETUP</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    ) : createEventStep === 2 ? (
                      <div className="space-y-5">
                        <div className="text-center">
                          <span className="text-[9px] text-brand uppercase tracking-widest font-bold">Step 2 of 3</span>
                          <h4 className="text-lg font-bold uppercase">Setup Tournament</h4>
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] uppercase font-bold text-gray-400 block">FORMAT</label>
                          <div className="grid grid-cols-2 gap-2">
                            {["Singles", "Doubles", "Mixed Doubles", "Team Event"].map((fmt) => (
                              <button
                                key={fmt}
                                onClick={() => setNewEventFormat(fmt)}
                                className={`py-3.5 rounded-xl border text-center font-bold uppercase ${
                                  newEventFormat === fmt ? "border-brand bg-[#121217] text-white" : "border-white/5 text-gray-400 bg-black/40"
                                }`}
                              >
                                {fmt}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2.5">
                          <label className="text-[10px] uppercase font-bold text-gray-400 block">PRIZE POOL REQUIREMENT (INR)</label>
                          <input
                            type="text"
                            value={newEventPrize}
                            onChange={(e) => setNewEventPrize(e.target.value)}
                            placeholder="e.g., 10,000..."
                            className="w-full h-12 bg-[#121217] border border-white/10 rounded-xl px-4 text-xs font-mono font-bold text-brand"
                          />
                        </div>

                        <button
                          onClick={() => setCreateEventStep(3)}
                          className="w-full bg-brand text-black font-extrabold h-14 rounded-xl flex items-center justify-center gap-1 hover:bg-brand-neon"
                        >
                          <span>CONTINUE TO POSTER ART</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        <div className="text-center">
                          <span className="text-[9px] text-[#cffc02] uppercase tracking-widest font-bold block">Step 3 of 3</span>
                          <h4 className="text-base font-extrabold uppercase">AI Sports Poster Generator</h4>
                        </div>

                        {/* Interactive poster preview Page 35 */}
                        <div className={`p-5 rounded-2xl border text-center space-y-3 relative overflow-hidden bg-gradient-to-tr from-black via-black/90 to-${generatedPoster.dominantColor || "indigo-600"}/20`}>
                          <span className="text-[9px] uppercase tracking-widest bg-brand/10 text-brand px-2 py-0.5 rounded border border-brand/20">AI Generated</span>
                          <h3 className="text-xl font-black italic uppercase tracking-tight text-white leading-none">
                            {generatedPoster.title || "Custom Tournament"}
                          </h3>
                          <span className="text-[10px] text-gray-400 font-mono tracking-widest block uppercase">- {generatedPoster.subtitle || "Championship"} -</span>
                          <p className="text-[10px] text-gray-300 italic px-2 leading-relaxed">
                            "{generatedPoster.visualConcept}"
                          </p>
                          <div className="flex gap-1.5 justify-center pt-2">
                            {generatedPoster.tags && generatedPoster.tags.map((tg: string) => (
                              <span key={tg} className="text-[9px] text-brand font-mono">#{tg}</span>
                            ))}
                          </div>
                        </div>

                        {/* Text prompts */}
                        <div className="space-y-3">
                          <label className="text-[10px] uppercase font-bold text-gray-400 block">AI Prompts style assistant</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={posterPrompt}
                              onChange={(e) => setPosterPrompt(e.target.value)}
                              placeholder="Describe your desired poster style... e.g., neon cricket batsman under green clouds"
                              className="flex-1 bg-[#121217] border border-white/10 rounded-xl px-4 text-xs"
                            />
                            <button
                              onClick={requestAIPoster}
                              disabled={isGeneratingPoster || !posterPrompt.trim()}
                              className="bg-brand text-black font-extrabold px-3 rounded-xl disabled:opacity-50"
                            >
                              Generate
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={finalizeEventCreation}
                          className="w-full bg-brand hover:bg-brand-neon text-black font-black h-14 rounded-xl flex items-center justify-center mt-4 shadow-lg shadow-brand/10"
                        >
                          PUBLISH WORK EVENT
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="px-5 py-4 space-y-5 flex-1 text-xs">
                    <div className="text-center">
                      <span className="text-[10px] text-brand-purple uppercase tracking-widest block font-bold">New Post</span>
                      <h4 className="text-lg font-bold uppercase italic font-display">Create Activity Post</h4>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">caption</label>
                        <textarea
                          rows={4}
                          value={newPostCaption}
                          onChange={(e) => setNewPostCaption(e.target.value)}
                          placeholder="What did you achieve today? e.g., 'Smashed 24 smash winners...'"
                          className="w-full bg-[#121217] border border-white/5 rounded-xl p-4 text-xs focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-gray-400 block">Audience Access Scope</label>
                        <select
                          value={newPostAudience}
                          onChange={(e) => setNewPostAudience(e.target.value)}
                          className="w-full h-11 bg-[#121217] border border-white/10 rounded-xl px-4 text-xs text-white"
                        >
                          <option value="Everyone">Everyone on Ziva</option>
                          <option value="Team Only">Only Team Members</option>
                          <option value="Club Members">Club Members Only</option>
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={finalizePostCreation}
                      disabled={!newPostCaption.trim()}
                      className="w-full bg-brand disabled:opacity-50 text-black font-extrabold h-14 rounded-xl hover:bg-brand-neon transition-all mt-4"
                    >
                      PUBLISH NOW
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>


          {/* PERSISTENT TAB BAR FOOTER ON THE HUB SCREEN */}
          <footer className="h-16 bg-[#0c0c0f] border-t border-white/[0.05] fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 flex justify-around items-center px-4 backdrop-blur-md bg-opacity-95">
            {[
              { id: "home", label: "Home", icon: HomeIcon },
              { id: "explore", label: "Explore", icon: Compass },
              { id: "teams", label: "Teams", icon: Users },
              { id: "performance", label: "Activity", icon: BarChart3 }
            ].map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setSelectedTournament(null);
                    setSelectedClub(null);
                    setSelectedMember(null);
                    setActiveChat(null);
                    setShowProfileDrawer(false);
                    setShowNotifications(false);
                    setShowMessagesPanel(false);
                  }}
                  className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                    isActive ? "text-[#cffc02] font-black" : "text-gray-500 hover:text-white"
                  }`}
                >
                  <IconComponent size={isActive ? 20 : 18} className={isActive ? "scale-110 drop-shadow-[0_0_8px_rgba(207,252,2,0.3)]" : ""} />
                  <span className="text-[9px] mt-1 uppercase font-bold tracking-widest">{tab.label}</span>
                </button>
              );
            })}

            {/* Quick action button matching create visual page */}
            <button
              onClick={() => {
                setShowCreateOverlay(true);
                setCreateWizardType(null);
              }}
              className="flex flex-col items-center justify-center flex-1 py-1 text-gray-500 hover:text-brand"
            >
              <PlusCircle size={18} className="text-brand animate-pulse" />
              <span className="text-[9px] mt-1 uppercase font-bold tracking-widest text-[#cffc02]">Create</span>
            </button>
          </footer>

        </div>
      )}
    </div>
  );
}
