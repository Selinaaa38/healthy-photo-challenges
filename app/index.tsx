import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Button } from "../components/Button";
import { Chip, ChipState } from "../components/Chip";
import { colours, space, type } from "../constants/theme";

// Temporary start screen so the project runs in Expo Go.
// It shows each Button variant and the three Chip states so they can be
// checked on a phone. Replaced by the Welcome screen in subtask 13.
export default function IndexScreen() {
  const show = (name: string) => Alert.alert("Button pressed", name);

  // Interest chips switch between default and selected.
  const [walking, setWalking] = useState<ChipState>("selected");
  // A "Never suggest" chip switches between default and excluded.
  const [running, setRunning] = useState<ChipState>("excluded");

  return (
    <View style={styles.container}>
      <Text style={styles.title} accessibilityRole="header">
        Healthy Photo Challenges
      </Text>
      <Text style={styles.subtitle}>Beta build in progress</Text>

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
          label="Explore first"
          variant="secondary"
          onPress={() => show("Secondary")}
        />
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
        <Button label="Disabled" disabled onPress={() => show("Disabled")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colours.bg,
    padding: space.xl,
  },
  title: {
    ...type.largeTitle,
    color: colours.text,
    textAlign: "center",
  },
  subtitle: {
    ...type.body,
    marginTop: space.sm,
    color: colours.muted,
    textAlign: "center",
  },
  heading: {
    ...type.bodyStrong,
    color: colours.text,
    marginTop: space.xxl,
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
});
