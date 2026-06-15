import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Google GenAI client
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// Global state to store newly created objects (Events, Teams, Posts, Registrations)
// This enables realistic database persistence across client sessions!
const persistenceStore = {
  teams: [
    {
      id: "thunder-strikers",
      name: "Thunder Strikers",
      logo: "⚡",
      sport: "Cricket",
      league: "College",
      location: "ISM Dhanbad",
      description: "Elite collegiate cricket squad prepping for the zoneals. Join our daily practices!",
      members: 24,
      spots: 10,
      sponsors: ["Nike", "Adidas", "Puma"]
    },
    {
      id: "hoop-hustlers",
      name: "Hoop Hustlers",
      logo: "🏀",
      sport: "Basketball",
      league: "Society",
      location: "Ashiyana Club",
      description: "Street-style half-court basketball group. Everyone welcome, casual matches on Wed/Sat.",
      members: 16,
      spots: 8,
      sponsors: ["Nike", "RedBull", "JBL"]
    },
    {
      id: "badminton-elite",
      name: "Badminton Elite",
      logo: "🏸",
      sport: "Badminton",
      league: "Corporate",
      location: "City Arena",
      description: "Fast-paced high-intensity badminton rallies. Master the smash and drop shot with us.",
      members: 14,
      spots: 11,
      sponsors: ["Yonex", "Li-Ning", "Victor"]
    }
  ],
  events: [
    {
      id: "dmsie-cup",
      title: "DMSIE Cup 2",
      sport: "Multi Sport",
      type: "Tournament",
      location: "ISM Indoor Stadium, Dhanbad",
      date: "12 - 20 Jul 2025",
      price: "1,499",
      prizePool: "10,000",
      description: "DMSIE Cup 2 multi-sport championship for the best college players.",
      rules: [
        { name: "Team Size", value: "11 Players" },
        { name: "Match Duration", value: "20 Over T20 format" },
        { name: "Powerplay", value: "First 6 overs of each innings" },
        { name: "Ball Type", value: "Official leather cricket ball" },
        { name: "Decision", value: "Third umpire reviews available" }
      ],
      schedule: [
        { time: "09:00 AM", t1: "Thunder XI", t2: "Warriors", status: "Upcoming" },
        { time: "11:30 AM", t1: "Strikers", t2: "Royal Kings", status: "Upcoming" },
        { time: "02:00 PM", t1: "Blasters", t2: "Champions", status: "Upcoming" }
      ]
    },
    {
      id: "summer-badminton",
      title: "Summer Badminton Championship",
      sport: "Badminton",
      type: "Tournament",
      location: "Mumbai",
      date: "12 - 16 Jun 2025",
      price: "799",
      prizePool: "15,000",
      description: "Intense badminton rallies for the ultimate local bragging rights.",
      rules: [
        { name: "Format", value: "Single Elimination Knockout" },
        { name: "Scoring", value: "Best of 3 sets, 21 points each" },
        { name: "Shuttlecock", value: "Yonex AS-30 feather shuttle" }
      ],
      schedule: []
    }
  ],
  posts: [
    {
      id: "post-1",
      author: "Thunder Strikers",
      authorLogo: "⚡",
      sport: "Cricket",
      time: "2h ago",
      caption: "Incredible chase by Thunder Strikers! 🔥 What a finish! 18 runs in the last over to seal the win. Champions play like this! 💪",
      image: "https://images.unsplash.com/photo-1540747737956-378724044453?w=800&q=80",
      heat: 9.4,
      comments: [
        { user: "Rahul Sharma", text: "That inning was unbelievable! 👏 Best game I have seen this year!" },
        { user: "Coach Vikram", text: "Incredible mental toughness in the final over, boys!" }
      ],
      voiceNote: true
    }
  ],
  registrations: [] as any[]
};

// API Endpoint: Ziva Coach AI analysis
app.post("/api/gemini/coach", async (req, res) => {
  const { message, history, stats } = req.body;
  const client = getAIClient();

  const formattedStats = stats
    ? JSON.stringify(stats)
    : "Overall Score: 84, Win Rate: 68%, Consistency: 79%, Court Coverage: 84%, Reaction Speed: 82%";

  const systemPrompt = `You are Ziva Coach, an elite AI sports performance coach inside the ZIVA Sports app.
You analyze athletes' metrics (such as heart rate, lung capacity, footwork quality, court coverage, and injury risk factors) and provide highly practical, expert, and encouraging high-performance recommendations.

Keep your tone:
- Professional, sharp, elite-level, and energetic.
- Dynamic like a coach who understands sports science.
- Concise and punchy. Aim for 2-3 short, highly actionable suggestions with bullet points.

Athlete Stats for Context: ${formattedStats}`;

  if (!client) {
    // Elegant fallback simulation when Gemini API Key is missing or default
    setTimeout(() => {
      res.json({
        text: `Hey Champ! Welcome to **Ziva Coach Dashboard**. 

Here are your live stats-based tactical analysis parameters for today:
* **Explosive Power (65%)**: Focus on lower-body dynamic exercises (e.g., box jumps, lunges) to increase your court coverage explosive speed.
* **Shoulder Load & Back Load (Moderate/Elevated Risk)**: We detected slight muscular fatigue tension here. Incorporate a 15-minute specialized dynamic recovery stretching routine today and set your next assessment date.
* **Shot Consistency (78%)**: Maintain high racquet velocity on clear shots, but shorten your follow-through in closer net duels to limit unforced drop errors.

*Let\'s keep pushing! Type any question below to tailor your daily plan.*`
      });
    }, 800);
    return;
  }

  try {
    const formattedContents = [
      { role: "user", parts: [{ text: `Active chat context history:\n${JSON.stringify(history || [])}\n\nClient message: ${message}` }] }
    ];

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents as any,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text || "Sorry, I could not generate a feedback right now." });
  } catch (error: any) {
    console.error("Gemini Coach Error:", error);
    res.json({
      text: `Tactical breakdown updated (offline fallback mode): Let's fine-tune your stability (82%) by introducing balanced core planks and keeping your footing centered during high-rebound lateral swings.`,
      error: error.message
    });
  }
});

// API Endpoint: AI Poster Art Assistant descriptions
app.post("/api/gemini/poster", async (req, res) => {
  const { prompt } = req.body;
  const client = getAIClient();

  const systemPrompt = `You are the AI Poster Assistant. You take sports event descriptions and output creative design descriptors for layout visual aesthetics, colors, lighting, and dramatic content tags.
Output a JSON response with:
1. title: Title of the event
2. subtitle: Catchy slogan
3. dominantColor: Tailwind string color (e.g. "lime-400", "violet-600", "cyan-400")
4. accentColor: Hex or text color
5. visualConcept: Description of the dramatic sport action (e.g., 'A lightning high-angle shot of a Badminton player flying through a cosmic purple background, shadow trailing, explosive particle trail, ultra dramatic lighting')
6. tags: list of 3 hashtags
Format the output as clean JSON only.`;

  if (!client) {
    // Dynamic premium template generation on the server when key is not active
    const sampleThemes = [
      {
        title: "Badminton Tournament 2025",
        subtitle: "SMASH. COMPETE. CONQUER.",
        dominantColor: "purple-600",
        accentColor: "yellow-400",
        visualConcept: "A stylized neon badminton athlete executing a mid-air smash with visual speed lines and gold dust, framed by a dark violet athletic quartz court.",
        tags: ["Badminton", "ISM", "Tournament"]
      },
      {
        title: "Night Cricket Clash",
        subtitle: "UNDER LIGHTS, EVERYTHING GLOWS.",
        dominantColor: "emerald-600",
        accentColor: "lime-300",
        visualConcept: "A powerful batsman hitting a ball with neon fire effects. The stadium is covered in stadium lights, creating hyper-detailed silhouettes and green auroras.",
        tags: ["Cricket", "UnderLights", "Clash"]
      }
    ];

    const selectedTheme = prompt && prompt.toLowerCase().includes("cricket") ? sampleThemes[1] : sampleThemes[0];
    res.json(selectedTheme);
    return;
  }

  try {
    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Generate poster designs parameters for user prompt: "${prompt}"`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: 0.8
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error) {
    console.error("Poster Gemini Error:", error);
    res.json({
      title: "Badminton Championship 2025",
      subtitle: "SMASH. COMPETE. CONQUER.",
      dominantColor: "violet-600",
      accentColor: "yellow-400",
      visualConcept: "A premium design featuring dynamic athletes against high-contrast lighting elements.",
      tags: ["Badminton", "Championship", "Ziva"]
    });
  }
});

// App lifecycle persistence CRUD endpoints
app.get("/api/store", (req, res) => {
  res.json(persistenceStore);
});

app.post("/api/store/teams", (req, res) => {
  const newTeam = {
    id: "team-" + Date.now(),
    name: req.body.name || "Unnamed Team",
    logo: req.body.logo || "🏆",
    sport: req.body.sport || "Badminton",
    league: req.body.league || "College",
    location: req.body.location || "Default Stadium",
    description: req.body.description || "Created with Ziva Club builder.",
    members: req.body.membersCount || 1,
    spots: 11,
    sponsors: ["Nike"]
  };
  persistenceStore.teams.push(newTeam);
  res.json({ success: true, team: newTeam });
});

app.post("/api/store/events", (req, res) => {
  const newEvent = {
    id: "event-" + Date.now(),
    title: req.body.title || "Elite Open event",
    sport: req.body.sport || "Badminton",
    type: req.body.type || "Tournament",
    location: req.body.location || "City Court Arena",
    date: req.body.date || "24 May 2025",
    price: req.body.price || "Free",
    prizePool: req.body.prizePool || "5,000",
    description: req.body.description || "An exciting athletic gathering generated dynamically.",
    rules: req.body.rules || [
      { name: "Team Size", value: "Singles/Doubles" },
      { name: "Format", value: "Knockout" }
    ],
    schedule: req.body.schedule || []
  };
  persistenceStore.events.push(newEvent);
  res.json({ success: true, event: newEvent });
});

app.post("/api/store/posts", (req, res) => {
  const newPost = {
    id: "post-" + Date.now(),
    author: req.body.author || "Guest Athlete",
    authorLogo: req.body.authorLogo || "🌟",
    sport: req.body.sport || "Badminton",
    time: "Just now",
    caption: req.body.caption || "",
    image: req.body.image || "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80",
    heat: 1.0,
    comments: [],
    voiceNote: false
  };
  persistenceStore.posts.unshift(newPost);
  res.json({ success: true, post: newPost });
});

app.post("/api/store/register", (req, res) => {
  const { eventId, registrationType, teamName, category, platformFee, totalPrice } = req.body;
  const reg = {
    id: "reg-" + Date.now(),
    eventId,
    registrationType,
    teamName,
    category,
    platformFee,
    totalPrice,
    timestamp: new Date().toISOString()
  };
  persistenceStore.registrations.push(reg);
  res.json({ success: true, registration: reg });
});


// Mounting Vite middleware or static server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Ziva Sports full-stack server running on http://localhost:${PORT}`);
  });
}

startServer();
