import { StyleSheet, Text, View } from "react-native";

// Temporary start screen so the project runs in Expo Go.
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
    backgroundColor: "#FFFFFF",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0A0A0A",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    color: "#6B6B6B",
  },
});
