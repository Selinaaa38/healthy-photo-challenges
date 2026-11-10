import { Alert, StyleSheet, Text, View } from "react-native";
import { Button } from "../components/Button";
import { colours, space, type } from "../constants/theme";

// Temporary start screen so the project runs in Expo Go.
// It shows each Button variant so they can be checked on a phone.
// Replaced by the Welcome screen in subtask 13.
export default function IndexScreen() {
  const show = (name: string) => Alert.alert("Button pressed", name);

  return (
    <View style={styles.container}>
      <Text style={styles.title} accessibilityRole="header">
        Healthy Photo Challenges
      </Text>
      <Text style={styles.subtitle}>Beta build in progress</Text>

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
  buttons: {
    marginTop: space.xxxl,
    gap: space.md,
  },
});
