export interface Team {
  id: string;
  name: string;
  logo: string;
  sport: string;
  league: string;
  location: string;
  description: string;
  members: number;
  spots: number;
  sponsors: string[];
}

export interface ClubMember {
  name: string;
  role: string;
  jersey: string;
  level: number;
  status: "Active" | "Inactive";
}

export interface RuleItem {
  name: string;
  value: string;
}

export interface MatchSchedule {
  time: string;
  t1: string;
  t2: string;
  status: string;
}

export interface SportEvent {
  id: string;
  title: string;
  sport: string;
  type: string;
  location: string;
  date: string;
  price: string;
  prizePool: string;
  description: string;
  rules: RuleItem[];
  schedule: MatchSchedule[];
}

export interface Post {
  id: string;
  author: string;
  authorLogo: string;
  sport: string;
  time: string;
  caption: string;
  image: string;
  heat: number;
  comments: { user: string; text: string }[];
  voiceNote?: boolean;
}

export interface UserProfile {
  name: string;
  level: number;
  xp: number;
  maxXp: number;
  club: string;
  sport: string;
}

export interface Registration {
  id: string;
  eventId: string;
  registrationType: "INDIVIDUAL" | "TEAM";
  teamName: string;
  category: string;
  platformFee: number;
  totalPrice: number;
  timestamp: string;
}
