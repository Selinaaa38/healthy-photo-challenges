import { ImageSourcePropType } from "react-native";
import { AppData, Challenge, Goal } from "../types";

// Seed data: the challenge catalogue and the starting app data.
// Simulated personal suggestions

export const challenges: Challenge[] = [
  // Move
  {
    id: "walk-campus",
    title: "Walk a loop around campus",
    goal: "Move",
    activity: "Walking",
    minutes: 10,
    steps: [
      "Head out between classes or after work",
      "Walk at an easy pace",
      "Snap a photo of a spot you liked",
    ],
    easierId: "walk-cafe",
    differentId: "stretch-desk",
  },
  {
    id: "walk-cafe",
    title: "5-minute walk to the nearest café",
    goal: "Move",
    activity: "Walking",
    minutes: 5,
    steps: ["Pick the closest café", "Walk there and back", "Snap your coffee or the view"],
  },
  {
    id: "walk-long",
    title: "Take the long way home",
    goal: "Move",
    activity: "Walking",
    minutes: 20,
    steps: ["Choose a longer route home", "Keep a steady pace", "Snap something new on the way"],
    easierId: "walk-campus",
  },
  {
    id: "stretch-desk",
    title: "Stretch at your desk",
    goal: "Move",
    minutes: 5,
    steps: ["Stand up and roll your shoulders", "Reach up, then touch your toes", "Snap your stretch spot"],
  },
  {
    id: "jog-block",
    title: "Jog around the block",
    goal: "Move",
    activity: "Running",
    minutes: 10,
    steps: ["Warm up with a short walk", "Jog one loop at an easy pace", "Snap the finish line"],
    easierId: "walk-cafe",
  },
  {
    id: "gym-circuit",
    title: "Quick gym circuit",
    goal: "Move",
    activity: "Gym",
    minutes: 20,
    steps: ["Pick three exercises", "Do three rounds", "Snap your favourite machine"],
    easierId: "stretch-desk",
  },
  {
    id: "yoga-flow",
    title: "Five-minute yoga flow",
    goal: "Move",
    activity: "Yoga",
    minutes: 5,
    steps: ["Roll out a mat or towel", "Follow five slow poses", "Snap your space"],
  },
  // Rest
  {
    id: "lights-out",
    title: "Lights out before 10:30 pm",
    goal: "Rest",
    minutes: 5,
    steps: ["Put your phone on charge away from bed", "Dim the lights", "Snap your bedside before lights out"],
  },
  {
    id: "breathe-five",
    title: "Breathe for five minutes",
    goal: "Rest",
    activity: "Meditating",
    minutes: 5,
    steps: ["Sit somewhere quiet", "Breathe in for 4, out for 6", "Snap where you sat"],
  },
  {
    id: "sunset-meditation",
    title: "Sunset meditation",
    goal: "Rest",
    activity: "Meditating",
    minutes: 7,
    steps: ["Find a spot with a view of the sky", "Sit and breathe slowly as the light changes", "Snap the sunset"],
    easierId: "breathe-five",
  },
  {
    id: "read-bed",
    title: "Read a chapter before bed",
    goal: "Rest",
    activity: "Reading",
    minutes: 20,
    steps: ["Choose a paper book", "Read one chapter", "Snap the page you stopped on"],
    easierId: "lights-out",
  },
  // Nourish
  {
    id: "fruit-snack",
    title: "Snack on some fruit",
    goal: "Nourish",
    minutes: 2,
    steps: ["Grab a piece of fruit", "Eat it away from your screen", "Snap your snack"],
  },
  {
    id: "rainbow-plate",
    title: "Cook a rainbow plate",
    goal: "Nourish",
    activity: "Cooking",
    minutes: 20,
    steps: ["Pick three colourful vegetables", "Cook a simple meal with them", "Snap your plate"],
    easierId: "fruit-snack",
  },
  // Unwind
  {
    id: "album",
    title: "Listen to a favourite album",
    goal: "Unwind",
    activity: "Music",
    minutes: 20,
    steps: ["Pick an album you love", "Listen without scrolling", "Snap the cover"],
    easierId: "three-good",
  },
  {
    id: "read-outside",
    title: "Read outside for ten minutes",
    goal: "Unwind",
    activity: "Reading",
    minutes: 10,
    steps: ["Take a book outside", "Read for ten minutes", "Snap your reading spot"],
  },
  {
    id: "three-good",
    title: "Write three good things",
    goal: "Unwind",
    minutes: 5,
    steps: ["Grab a notebook", "Write three good things from today", "Snap your list"],
  },
  // Hydrate
  {
    id: "water-bottle",
    title: "Refill your water bottle",
    goal: "Hydrate",
    minutes: 2,
    steps: ["Find your water bottle", "Fill it up and take a few sips", "Snap your bottle"],
  },
  {
    id: "herbal-tea",
    title: "Make a cup of herbal tea",
    goal: "Hydrate",
    minutes: 5,
    steps: ["Boil the kettle", "Brew a herbal tea", "Snap your mug"],
  },
];

// Shown after "Explore first", before any preferences are set
export const generalChallengeIds = ["walk-campus", "fruit-snack", "lights-out"];

// Today's Daily Special, released to everyone in the time-zone group.
export const dailySpecial = {
  challengeId: "sunset-meditation",
  closesAt: "20:00",
};

// Placeholder photos. 
export const goalImages: Record<Goal, ImageSourcePropType> = {
  Move: require("../assets/images/move.jpg"),
  Rest: require("../assets/images/rest.jpg"),
  Nourish: require("../assets/images/nourish.jpg"),
  Unwind: require("../assets/images/sunset.jpg"),
  Hydrate: require("../assets/images/hydrate.jpg"),
};
export const specialImage: ImageSourcePropType = require("../assets/images/sunset.jpg");
export const postImages: Record<string, ImageSourcePropType> = {
  "post-vanessa": require("../assets/images/meal.jpg"),
};

// Options shown on the preferences screen.
export const goalOptions = ["Move", "Rest", "Nourish", "Unwind", "Hydrate"] as const;
export const interestOptions = ["Walking", "Meditating", "Cooking", "Reading", "Music"];
export const excludeOptions = ["Running", "Gym", "Yoga"];
export const minuteOptions = [5, 10, 20] as const;

// Rewards
export const plantsPerWorld = 12;
export const worlds = ["Spring meadow", "Riverbank", "Mountain grove"];

// People who can be invited to a new circle.
export const contacts = ["Taylor", "Vanessa", "Sam", "Jordan"];

// Starting data the first time the app opens, and after "Reset demo data".
const hoursAgo = (hours: number) =>
  new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

export const createInitialData = (): AppData => ({
  userName: "Selina",
  preferences: null,
  specialAlerts: true,
  theme: "Garden",
  plants: 8,
  tasks: generalChallengeIds.map((id) => ({ challengeId: id, status: "active" })),
  checkIns: [],
  circles: [
    {
      id: "family",
      name: "Family",
      members: ["You", "Taylor", "Vanessa", "Mum"],
      pending: [],
    },
    {
      id: "uni-friends",
      name: "Uni friends",
      members: ["You", "Sam", "Jordan", "Priya", "Alex"],
      pending: ["Chris"],
    },
  ],
  invitations: [
    { id: "uni-club", circleName: "Uni Club", inviter: "Dan", memberCount: 4 },
  ],
  posts: [
    {
      id: "post-vanessa",
      circleId: "family",
      author: "Vanessa",
      challengeId: "rainbow-plate",
      caption: "Rainbow plate attempt #2",
      createdAt: hoursAgo(2),
      reactions: {
        cheer: ["Taylor", "Mum"],
        love: ["Taylor", "Mum"],
        metoo: [],
      },
      comments: [
        {
          id: "comment-taylor",
          author: "Taylor",
          text: "Omg that looks amazing!",
          createdAt: hoursAgo(1),
        },
      ],
    },
  ],
});
