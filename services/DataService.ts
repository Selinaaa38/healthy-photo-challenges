import AsyncStorage from "@react-native-async-storage/async-storage";
import { challenges, createInitialData, dailySpecial, generalChallengeIds } from "../data/seed";
import { AppData, Audience, Circle, Preferences, Task } from "../types";

// Saves all app data under one key
const STORAGE_KEY = "@healthy-photo-challenges";

export const getChallenge = (id: string) => challenges.find((c) => c.id === id)!;

const isExcluded = (activity: string | undefined, prefs: Preferences | null) =>
  !!activity && !!prefs?.excluded.includes(activity);

// Up to 3 challenges that fit the user's goals, time and exclusions,
// with challenges they enjoy first
export const suggestChallenges = (prefs: Preferences) => {
  const fits = challenges.filter(
    (c) =>
      c.id !== dailySpecial.challengeId &&
      (prefs.goals.length === 0 || prefs.goals.includes(c.goal)) &&
      c.minutes <= prefs.minutes &&
      !isExcluded(c.activity, prefs),
  );
  const enjoyed = fits.filter((c) => c.activity && prefs.interests.includes(c.activity));
  const ids = [...enjoyed, ...fits.filter((c) => !enjoyed.includes(c))].map((c) => c.id);
  return ids.length > 0 ? ids.slice(0, 3) : generalChallengeIds;
};

// An easier (same goal, shorter) or different (other activity) challenge
// that is not already on today's list
export const getAlternative = (id: string, kind: "easier" | "different", data: AppData) => {
  const current = getChallenge(id);
  const linkedId = kind === "easier" ? current.easierId : current.differentId;
  if (linkedId) return getChallenge(linkedId);
  const taken = data.tasks.map((t) => t.challengeId);
  return challenges.find(
    (c) =>
      !taken.includes(c.id) &&
      c.id !== dailySpecial.challengeId &&
      !isExcluded(c.activity, data.preferences) &&
      (kind === "easier"
        ? c.goal === current.goal && c.minutes < current.minutes
        : c.activity !== current.activity),
  );
};

// B1: returns an error message, or null if the name
export const circleNameError = (name: string, circles: Circle[]) => {
  const trimmed = name.trim();
  if (trimmed === "") return "Enter a name for your circle";
  if (trimmed.length > 30) return "Use 30 characters or fewer";
  if (circles.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) {
    return `You already have a circle called "${trimmed}"`;
  }
  return null;
};

// Replaces the task for a challenge, or adds it if it isn't on the list.
const setTask = (data: AppData, oldId: string, task: Task) => {
  const index = data.tasks.findIndex((t) => t.challengeId === oldId);
  if (index === -1) data.tasks.push(task);
  else data.tasks[index] = task;
};

export default {
  async getData(): Promise<AppData> {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : createInitialData();
  },

  // Loads the data, applies a change and saves it.
  async update(change: (data: AppData) => void): Promise<AppData> {
    const data = await this.getData();
    change(data);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  },

  // True once onboarding is finished, because something has been saved.
  async isSetUp(): Promise<boolean> {
    return (await AsyncStorage.getItem(STORAGE_KEY)) !== null;
  },

  // Saves fresh starting data ("Explore first" and "Skip for now").
  async start(): Promise<AppData> {
    const data = createInitialData();
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  },

  // Reset demo data
  async clear() {
    await AsyncStorage.removeItem(STORAGE_KEY);
  },

  savePreferences(prefs: Preferences) {
    return this.update((data) => {
      data.preferences = prefs;
      data.tasks = suggestChallenges(prefs).map((id) => ({ challengeId: id, status: "active" }));
    });
  },

  // One plant per completed challenge (US07).
  completeChallenge(challengeId: string, photoUri: string, caption: string, audience: Audience) {
    return this.update((data) => {
      data.checkIns.unshift({
        id: Date.now().toString(),
        challengeId,
        photoUri,
        caption,
        audience,
        createdAt: new Date().toISOString(),
      });
      setTask(data, challengeId, { challengeId, status: "completed" });
      data.plants += 1;
    });
  },

  swapChallenge(oldId: string, newId: string) {
    return this.update((data) => setTask(data, oldId, { challengeId: newId, status: "active" }));
  },

  scheduleChallenge(challengeId: string, scheduledFor: string) {
    return this.update((data) =>
      setTask(data, challengeId, { challengeId, status: "scheduled", scheduledFor }),
    );
  },

  // Skipping never removes plants, so progress is kept (US10).
  skipChallenge(challengeId: string, skipReason: string, skipNote: string) {
    return this.update((data) =>
      setTask(data, challengeId, { challengeId, status: "skipped", skipReason, skipNote }),
    );
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

  addComment(postId: string, text: string) {
    return this.update((data) => {
      data.posts
        .find((p) => p.id === postId)!
        .comments.push({ id: Date.now().toString(), author: "You", text, createdAt: new Date().toISOString() });
    });
  },

  // Invited people stay pending and can't see posts until they accept (US12).
  createCircle(name: string, invited: string[]) {
    return this.update((data) => {
      data.circles.push({ id: Date.now().toString(), name: name.trim(), members: ["You"], pending: invited });
    });
  },

  // Accepting adds the circle; declining just removes the invitation (US13).
  answerInvitation(invitationId: string, accept: boolean) {
    return this.update((data) => {
      const invitation = data.invitations.find((i) => i.id === invitationId)!;
      data.invitations = data.invitations.filter((i) => i.id !== invitationId);
      if (accept) {
        data.circles.push({
          id: invitation.id,
          name: invitation.circleName,
          members: ["You", invitation.inviter],
          pending: [],
        });
      }
    });
  },
};
