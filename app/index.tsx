import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../components/Button";
import { ChallengeRow } from "../components/ChallengeRow";
import { Chip, ChipState } from "../components/Chip";
import { PostCard, Reaction } from "../components/PostCard";
import { ProgressBar } from "../components/ProgressBar";
import { colours, space, type } from "../constants/theme";

// Temporary start screen so the project runs in Expo Go.
// It shows each shared component so they can be checked on a phone.
// Replaced by the Welcome screen in subtask 13.
export default function IndexScreen() {
  const show = (name: string) => Alert.alert("Pressed", name);

  // Interest chips switch between default and selected.
  const [walking, setWalking] = useState<ChipState>("selected");
  // A "Never suggest" chip switches between default and excluded.
  const [running, setRunning] = useState<ChipState>("excluded");

  // Sample reactions for the post. Tapping one adds or removes "my" reaction.
  const [reactions, setReactions] = useState<Reaction[]>([
    { id: "cheer", label: "Cheer", icon: "sparkles", count: 3, reactedByMe: true },
    { id: "love", label: "Love", icon: "heart", count: 2, reactedByMe: false },
    { id: "metoo", label: "Me too", icon: "thumbs-up", count: 0, reactedByMe: false },
  ]);

  const toggleReaction = (id: string) => {
    setReactions((previous) =>
      previous.map((reaction) =>
        reaction.id === id
          ? {
              ...reaction,
              reactedByMe: !reaction.reactedByMe,
              count: reaction.count + (reaction.reactedByMe ? -1 : 1),
            }
          : reaction,
      ),
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title} accessibilityRole="header">
          Healthy Photo Challenges
        </Text>
        <Text style={styles.subtitle}>Beta build in progress</Text>

        <Text style={styles.heading}>Challenge rows</Text>
        <View style={styles.rows}>
          <ChallengeRow
            title="Walk a loop around campus"
            minutes={10}
            goal="Move"
            onPress={() => show("Walk a loop around campus")}
          />
          <ChallengeRow
            title="Snack on some fruit"
            minutes={2}
            goal="Nourish"
            onPress={() => show("Snack on some fruit")}
          />
        </View>

        <Text style={styles.heading}>Progress bar</Text>
        <Text style={styles.progressLabel}>9 of 12 plants grown</Text>
        <ProgressBar value={9} total={12} highlightLatest />

        <Text style={styles.heading}>Chips (tap to change)</Text>
        <View style={styles.chips}>
          <Chip
            label="Walking"
            state={walking}
            onPress={() =>
              setWalking(walking === "selected" ? "default" : "selected")
            }
          />
          <Chip
            label="Running"
            state={running}
            accessibilityHint="Tap to exclude this activity"
            onPress={() =>
              setRunning(running === "excluded" ? "default" : "excluded")
            }
          />
          <Chip label="Yoga" state="default" onPress={() => {}} />
        </View>

        <Text style={styles.heading}>Buttons</Text>
        <View style={styles.buttons}>
          <Button label="Start challenge" onPress={() => show("Primary")} />
          <Button
            label="Replace photo"
            variant="secondary"
            icon="refresh"
            onPress={() => show("Secondary with icon")}
          />
          <Button
            label="Delete check-in"
            variant="destructive"
            onPress={() => show("Destructive")}
          />
          <Button
            label="Skip for now"
            variant="text"
            onPress={() => show("Text")}
          />
        </View>

        <Text style={styles.heading}>Post card (tap a reaction)</Text>
        <View style={styles.fullWidth}>
          <PostCard
            author="Vanessa"
            audience="Family only"
            timeAgo="2h ago"
            goal="Nourish"
            caption="Rainbow plate attempt #2"
            reactions={reactions}
            onReact={toggleReaction}
            onMore={() => show("Post options")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colours.bg,
  },
  container: {
    padding: space.xl,
    paddingBottom: space.xxxl,
  },
  title: {
    ...type.largeTitle,
    color: colours.text,
  },
  subtitle: {
    ...type.body,
    marginTop: space.xs,
    color: colours.muted,
  },
  heading: {
    ...type.bodyStrong,
    color: colours.text,
    marginTop: space.xxl,
    marginBottom: space.sm,
  },
  rows: {
    gap: space.md,
  },
  progressLabel: {
    ...type.footnoteStrong,
    color: colours.text,
    marginBottom: space.sm,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space.sm,
  },
  buttons: {
    gap: space.md,
  },
  fullWidth: {
    // The post photo runs edge to edge, so undo the screen padding.
    marginHorizontal: -space.xl,
  },
});
