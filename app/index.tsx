import { StyleSheet, Text, View } from "react-native";
import { colours, space, type } from "../constants/theme";

// Temporary start screen so the project runs in Expo Go.
// It uses the design tokens from constants/theme.ts.
// Replaced by the Welcome screen in subtask 13.
export default function IndexScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title} accessibilityRole="header">
        Healthy Photo Challenges
      </Text>
      <Text style={styles.subtitle}>Beta build in progress</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colours.bg,
    padding: space.xxl,
  },
  title: {
    ...type.largeTitle,
    color: colours.text,
  },
  subtitle: {
    ...type.body,
    marginTop: space.sm,
    color: colours.muted,
  },
});
