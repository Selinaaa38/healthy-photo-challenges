import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colours, space, type } from "../constants/theme";

// Temporary screen used while the navigation is being built.
// Each placeholder shows the screen's name, which Figma screen it becomes,
// and buttons to move through the flow.

type PlaceholderScreenProps = {
  title: string;
  figma: string; // e.g. "Figma 03 Today"
  children?: ReactNode; // navigation buttons
};

export function PlaceholderScreen({
  title,
  figma,
  children,
}: PlaceholderScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <Text style={styles.title} accessibilityRole="header">
          {title}
        </Text>
        <Text style={styles.note}>{figma} · coming soon</Text>
        <View style={styles.actions}>{children}</View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colours.bg,
  },
  container: {
    flex: 1,
    padding: space.xl,
  },
  title: {
    ...type.largeTitle,
    color: colours.text,
  },
  note: {
    ...type.footnote,
    color: colours.muted,
    marginTop: space.xs,
  },
  actions: {
    marginTop: space.xxl,
    gap: space.md,
  },
});
