import { ImageSourcePropType } from "react-native";

export type Goal = "Move" | "Rest" | "Nourish" | "Unwind" | "Hydrate";
export type Minutes = 5 | 10 | 20;

// A challenge from the catalogue in data/seed.ts.
export type Challenge = {
  id: string;
  title: string;
  goal: Goal;
  activity?: string; // matches an "I enjoy" / "Never suggest" chip, e.g. "Walking"
  minutes: number;
  steps: string[];
  image: ImageSourcePropType; // photo in assets/images
  easierId?: string; // shorter challenge with the same goal
  differentId?: string; // different activity
};

export type Preferences = {
  goals: Goal[];
  interests: string[];
  excluded: string[]; // "Never suggest"
  minutes: Minutes;
};

// What has happened to one of today's challenges.
export type TaskStatus = "active" | "scheduled" | "skipped" | "completed";

export type Task = {
  challengeId: string;
  status: TaskStatus;
  scheduledFor?: string; // ISO date and time, for "Schedule for later"
  skipReason?: string; // "Too busy", "Not interested", ...
  skipNote?: string;
};

// "private" or the id of a circle.
export type Audience = "private" | string;

export type CheckIn = {
  id: string;
  challengeId: string;
  photoUri: string;
  selfieUri?: string; // optional selfie (B3)
  caption: string;
  audience: Audience;
  createdAt: string; // ISO date and time
};

export type Comment = {
  id: string;
  author: string;
  text: string;
  createdAt: string;
};

export type Reactions = Record<"cheer" | "love" | "metoo", string[]>; // who reacted

// A post from another member of a circle (simulated in the seed data).
export type Post = {
  id: string;
  circleId: string;
  author: string;
  challengeId: string;
  caption: string;
  createdAt: string;
  reactions: Reactions;
  comments: Comment[];
};

export type Circle = {
  id: string;
  name: string;
  members: string[]; // "You" is the user
  pending: string[]; // invited but not yet accepted: can't see posts
};

export type Invitation = {
  id: string;
  circleName: string;
  inviter: string;
  memberCount: number;
};

export type Theme = "Garden" | "Pets" | "Sanctuary";

// Everything the app saves on the phone.
export type AppData = {
  userName: string;
  preferences: Preferences | null; // null until set, or after "Explore first"
  specialAlerts: boolean; // Daily Special notifications toggle
  theme: Theme;
  plants: number; // one per completed challenge
  tasks: Task[]; // today's everyday challenges and the Daily Special
  checkIns: CheckIn[];
  circles: Circle[];
  invitations: Invitation[];
  posts: Post[];
};
