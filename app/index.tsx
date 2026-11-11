import { Redirect } from "expo-router";

// App entry point. Like the Week 7 and 8 lectures, the index screen just
// redirects. For now it always opens Welcome; in subtask 12 it will skip
// straight to Today once preferences have been saved.
export default function IndexScreen() {
  return <Redirect href="/onboarding" />;
}
