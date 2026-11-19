import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  challenges,
  createInitialData,
  dailySpecial,
  generalChallengeIds,
  swapChallengeIds,
} from "../data/seed";
import { AppData, Audience, Circle, Preferences, Task } from "../types";

// Saves all app data under one key
const STORAGE_KEY = "@healthy-photo-challenges";

export const getChallenge = (id: string) => challenges.find((c) => c.id === id)!;

const isExcluded = (activity: string | undefined, prefs: Preferences | null) =>
  !!activity && !!prefs?.excluded.includes(activity);

// Filter and select challenges
export const suggestChallenges = (prefs: Preferences) => {
  const fits = challenges.filter(
    (c) =>
      c.id !== dailySpecial.challengeId &&
      c.id !== swapChallengeIds.easier &&
      c.id !== swapChallengeIds.different &&
      (prefs.goals.length === 0 || prefs.goals.includes(c.goal)) &&
      c.minutes <= prefs.minutes &&
      !isExcluded(c.activity, prefs),
  );
  const enjoyed = fits.filter((c) => c.activity && prefs.interests.includes(c.activity));
  const ids = [...enjoyed, ...fits.filter((c) => !enjoyed.includes(c))].map((c) => c.id);
  return ids.length > 0 ? ids.slice(0, 3) : generalChallengeIds;
};

// Select easier or differenc challenge
export const getAlternative = (id: string, kind: "easier" | "different") => {
  const offered = swapChallengeIds[kind];
  const other = swapChallengeIds[kind === "easier" ? "different" : "easier"];
  return getChallenge(id === offered ? other : offered);
};

// B1: Validate circle name for empty, long or duplication
export const circleNameError = (name: string, circles: Circle[]) => {
  const trimmed = name.trim();
  if (trimmed === "") return "Enter a name for your circle";
  if (trimmed.length > 30) return "Use 30 characters or fewer";
  if (circles.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) {
    return `You already have a circle called "${trimmed}"`;
  }
  return null;
};

export const describeMembers = (circle: Circle) =>
  circle.members.length === 1
    ? "Just you so far"
    : circle.members.length <= 4
      ? `${circle.members.slice(0, -1).join(", ")} and ${circle.members.at(-1)}`
      : `${circle.members.length} people`;

// Add or replace a task in current task list
const setTask = (data: AppData, oldId: string, task: Task) => {
  const index = data.tasks.findIndex((t) => t.challengeId === oldId);
  if (index === -1) data.tasks.push(task);
  else data.tasks[index] = task;
};

export default {
  // Load saved data or use initial data if none exists
  async getData(): Promise<AppData> {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : createInitialData();
  },

  // Apply changes and save updated data
  async update(change: (data: AppData) => void): Promise<AppData> {
    const data = await this.getData();
    change(data);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  },

  // Check if app has ben set up
  async isSetUp(): Promise<boolean> {
    return (await AsyncStorage.getItem(STORAGE_KEY)) !== null;
  },

  // Start with default and demo data
  async start(): Promise<AppData> {
    const data = createInitialData();
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  },

  // Reset demo data
  async clear() {
    await AsyncStorage.removeItem(STORAGE_KEY);
  },

  // Save preferences and generate personalised challenges
  savePreferences(prefs: Preferences) {
    return this.update((data) => {
      data.preferences = prefs;
      data.tasks = suggestChallenges(prefs).map((id) => ({ challengeId: id, status: "active" }));
    });
  },

  // Save checkin, complete task and award one plant (US07).
  completeChallenge(
    challengeId: string,
    photoUri: string,
    selfieUri: string | undefined,
    caption: string,
    audience: Audience,
  ) {
    return this.update((data) => {
      data.checkIns.unshift({
        id: Date.now().toString(),
        challengeId,
        photoUri,
        selfieUri,
        caption,
        audience,
        createdAt: new Date().toISOString(),
      });
      setTask(data, challengeId, { challengeId, status: "completed" });
      data.plants += 1;
    });
  },

  // Replace current challenge with alternative
  swapChallenge(oldId: string, newId: string) {
    return this.update((data) => setTask(data, oldId, { challengeId: newId, status: "active" }));
  },

  // Save future date and time for challenge
  scheduleChallenge(challengeId: string, scheduledFor: string) {
    return this.update((data) =>
      setTask(data, challengeId, { challengeId, status: "scheduled", scheduledFor }),
    );
  },

  // Mark challenge as skipped without reward loss (US10).
  skipChallenge(challengeId: string, skipReason: string, skipNote: string) {
    return this.update((data) =>
      setTask(data, challengeId, { challengeId, status: "skipped", skipReason, skipNote }),
    );
  },

  // Undo a skip
  undoSkip(challengeId: string) {
    return this.update((data) => setTask(data, challengeId, { challengeId, status: "active" }));
  },

  // Tapping a reaction again removes it (B5).
  toggleReaction(postId: string, reaction: "cheer" | "love" | "metoo") {
    return this.update((data) => {
      const post = data.posts.find((p) => p.id === postId)!;
      const people = post.reactions[reaction];
      post.reactions[reaction] = people.includes("You")
        ? people.filter((name) => name !== "You")
        : [...people, "You"];
    });
  },

  // Add a comment to a post
  addComment(postId: string, text: string) {
    return this.update((data) => {
      data.posts
        .find((p) => p.id === postId)!
        .comments.push({ id: Date.now().toString(), author: "You", text, createdAt: new Date().toISOString() });
    });
  },

  // Update who can see an existing check-in
  changeAudience(checkInId: string, audience: Audience) {
    return this.update((data) => {
      data.checkIns.find((c) => c.id === checkInId)!.audience = audience;
    });
  },

  // Delete a check-in while keeping earned rewards
  deleteCheckIn(checkInId: string) {
    return this.update((data) => {
      data.checkIns = data.checkIns.filter((c) => c.id !== checkInId);
    });
  },

  // Remove a comment from post
  deleteComment(postId: string, commentId: string) {
    return this.update((data) => {
      const post = data.posts.find((p) => p.id === postId)!;
      post.comments = post.comments.filter((c) => c.id !== commentId);
    });
  },

  // Remove a circle from user's list
  leaveCircle(circleId: string) {
    return this.update((data) => {
      data.circles = data.circles.filter((c) => c.id !== circleId);
    });
  },

  // Invited people stay pending and can't see posts until they accept (US12).
  // Create circle with pending invite
  createCircle(name: string, invited: string[]) {
    return this.update((data) => {
      data.circles.push({ id: Date.now().toString(), name: name.trim(), members: ["You"], pending: invited });
    });
  },

  // Accepting adds the circle; declining removes the invitation (US13).
  answerInvitation(invitationId: string, accept: boolean) {
    return this.update((data) => {
      const invitation = data.invitations.find((i) => i.id === invitationId)!;
      data.invitations = data.invitations.filter((i) => i.id !== invitationId);
      if (accept) {
        data.circles.push({
          id: invitation.id,
          name: invitation.circleName,
          members: ["You", ...invitation.members],
          pending: [],
        });
      }
    });
  },
};
