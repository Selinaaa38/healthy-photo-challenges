import { Ionicons } from "@react-native-vector-icons/ionicons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/Button";
import { ProgressBar } from "../../components/ProgressBar";
import { colours, radius, sizes, space, type } from "../../constants/theme";
import { plantsPerWorld } from "../../data/seed";
import DataService from "../../services/DataService";
import { AppData } from "../../types";

// Challenge complete: +1 plant and progress to the next world (US07).
export default function CompleteScreen() {
  const [data, setData] = useState<AppData>();

  useEffect(() => {
    DataService.getData().then(setData);
  }, []);

  if (!data) return null;

  // 1-12 in the current world; a full world shows 12 of 12
  const grown = data.plants % plantsPerWorld || plantsPerWorld;
  const toGo = plantsPerWorld - grown;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <View>
          <Image
            source={{ uri: data.checkIns[0]?.photoUri }}
            style={styles.photo}
            accessibilityLabel="Your check-in photo"
          />
          <View style={styles.tick}>
            <Ionicons name="checkmark" size={26} color={colours.onPrimary} />
          </View>
        </View>

        <Text style={styles.title} accessibilityRole="header">
          Challenge complete
        </Text>
        <View style={styles.plantBadge}>
          <Ionicons name="leaf" size={14} color={colours.success} />
          <Text style={styles.plantText}>+1 plant in your garden</Text>
        </View>

        <View style={styles.progress}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>
              {grown} of {plantsPerWorld} plants grown
            </Text>
            <Text style={styles.toGo}>{toGo > 0 ? `${toGo} to go` : "World complete"}</Text>
          </View>
          <ProgressBar value={grown} total={plantsPerWorld} highlightLatest />
          <Text style={styles.progressNote}>
            {toGo > 0
              ? `${toGo} more to unlock a new world. Private and shared check-ins earn the same.`
              : "You unlocked a new world. See it in Rewards."}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Button label="Back to home" onPress={() => router.dismissTo("/today")} />
        <Button label="Do another challenge" variant="text" onPress={() => router.replace("/checkin")} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colours.bg,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: sizes.screenPadding,
    gap: space.md,
  },
  photo: {
    width: 190,
    height: 250,
    borderRadius: radius.xl,
    backgroundColor: colours.placeholder,
  },
  tick: {
    position: "absolute",
    right: -12,
    bottom: -12,
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: colours.bg,
    backgroundColor: colours.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    ...type.title,
    color: colours.text,
    marginTop: space.md,
  },
  plantBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.xs,
    paddingHorizontal: space.md,
    paddingVertical: space.xs,
    borderRadius: radius.pill,
    backgroundColor: colours.successTint,
  },
  plantText: {
    ...type.footnoteStrong,
    color: colours.success,
  },
  progress: {
    alignSelf: "stretch",
    gap: space.sm,
    padding: space.lg,
    borderRadius: radius.md,
    backgroundColor: colours.surface,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressTitle: {
    ...type.bodyStrong,
    color: colours.text,
  },
  toGo: {
    ...type.footnote,
    color: colours.muted,
  },
  progressNote: {
    ...type.footnote,
    color: colours.muted,
  },
  actions: {
    paddingHorizontal: sizes.screenPadding,
    paddingBottom: space.md,
    gap: space.xs,
  },
});
