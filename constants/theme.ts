import { TextStyle } from "react-native";

// Colours
export const colours = {
  bg: "#FFFFFF",
  surface: "#F4F4F5",
  elevated: "#EBEBEC",
  line: "#E4E4E7",
  text: "#0A0A0A",
  muted: "#6B6B6B",
  accent: "#B45309",
  success: "#2F7D57",
  successTint: "#E7F4EC",
  onPrimary: "#FFFFFF",
  error: "#C62828",
  errorTint: "#FDECEC",
  primary: "#0A0A0A",
  placeholder: "#E9E9EB",
  overlay: "rgba(0, 0, 0, 0.45)", // darkens photos so white text is readable
  onImageMuted: "rgba(255, 255, 255, 0.8)", // secondary text on photos
  overlayStrong: "rgba(0, 0, 0, 0.6)", // badges on photos
  accentLight: "#FBBF24", // amber on dark photos ("Closes 8:00 pm")
};

// Text styles from the font sizes and weights
export const type = {
  display: { fontSize: 42, fontWeight: "700" }, // Welcome title
  largeTitle: { fontSize: 30, fontWeight: "700" }, // "Today", "Circles"
  title: { fontSize: 26, fontWeight: "700" }, // "What would help most?"
  headline: { fontSize: 22, fontWeight: "700" }, // challenge and card titles
  sectionTitle: { fontSize: 17, fontWeight: "600" }, // screen header titles
  button: { fontSize: 16, fontWeight: "600" }, // button labels
  body: { fontSize: 15, fontWeight: "400" }, // body text
  bodyMedium: { fontSize: 15, fontWeight: "500" }, // chip labels
  bodyStrong: { fontSize: 15, fontWeight: "600" }, // group headings
  callout: { fontSize: 14, fontWeight: "400" }, // explanations
  calloutStrong: { fontSize: 14, fontWeight: "600" }, // "Why this suggestion?"
  footnote: { fontSize: 13, fontWeight: "400" }, // secondary lines
  footnoteStrong: { fontSize: 13, fontWeight: "600" }, // "9 of 12 plants"
  caption: { fontSize: 12, fontWeight: "400" }, // names under avatars
  captionStrong: { fontSize: 12, fontWeight: "600" }, // badges
  tabLabel: { fontSize: 11, fontWeight: "500" }, // tab bar labels
  overline: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  }, // "PREVIEW", "STEP 1 OF 2"
} satisfies Record<string, TextStyle>;

// Spacing, corner radius and size values
export const space = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20, // screen side padding
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16, // cards
  xl: 20, // large photo cards
  sheet: 28, // top corners of modal sheets
  pill: 999, // buttons and chips
};

export const sizes = {
  button: 52, // primary button height
  minTouch: 44, // minimum touch target
  screenPadding: 20,
};
