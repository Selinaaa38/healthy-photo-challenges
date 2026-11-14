import { Ionicons } from "@react-native-vector-icons/ionicons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "../../../components/Button";
import { colours, radius, sizes, space, type } from "../../../constants/theme";
import { dailySpecial } from "../../../data/seed";
import DataService, { getChallenge } from "../../../services/DataService";
import { AppData } from "../../../types";

// "Not right now?" options, each opening a sheet
const options = [
  { label: "Something easier", icon: "leaf-outline", pathname: "/today/easier" },
  { label: "Schedule for later", icon: "calendar-outline", pathname: "/today/schedule" },
  { label: "Skip today", icon: "close", pathname: "/today/skip" },
] as const;

// Challenge details: steps, why it was suggested, and the
// "Not right now?" options (US03, US08, US09, US10).
export default function ChallengeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [data, setData] = useState<AppData>();

  useFocusEffect(
    useCallback(() => {
      DataService.getData().then(setData);
    }, []),
  );

  if (!data) return null;

  const challenge = getChallenge(id);
  const isSpecial = id === dailySpecial.challengeId;
  const isDone = data.tasks.some((t) => t.challengeId === id && t.status === "completed");
  const prefs = data.preferences;

  // Explains the suggestion using the user's own preferences.
  const why = isSpecial
    ? "Today's Daily Special. It's optional and the same for everyone."
    : prefs
      ? `You chose ${challenge.goal}${
          challenge.activity && prefs.interests.includes(challenge.activity)
            ? ` and ${challenge.activity}`
            : ""
        }, and prefer about ${prefs.minutes} minutes.`
      : "A general challenge to get you started. Set preferences in Profile to personalise.";

  // The Daily Special can only be skipped.
  const shownOptions = isSpecial ? options.slice(2) : options;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
    >
      <Image
        source={challenge.image}
        style={styles.photo}
        accessible={false}
      />

      <View style={styles.tags}>
        <Text style={styles.tag}>{challenge.goal}</Text>
        <View style={styles.tagRow}>
          <Ionicons name="time-outline" size={14} color={colours.text} />
          <Text style={styles.tagText}>~{challenge.minutes} min</Text>
        </View>
      </View>

      <Text style={styles.title} accessibilityRole="header">
        {challenge.title}
      </Text>

      <Text style={styles.label}>How to do it</Text>
      {challenge.steps.map((step, index) => (
        <View key={step} style={styles.step} accessible accessibilityLabel={`Step ${index + 1}: ${step}`}>
          <Text style={styles.stepNumber}>{index + 1}</Text>
          <Text style={styles.stepText}>{step}</Text>
        </View>
      ))}

      <View style={styles.why} accessible>
        <Ionicons name="information-circle-outline" size={20} color={colours.muted} />
        <View style={styles.whyText}>
          <Text style={styles.whyTitle}>Why this suggestion?</Text>
          <Text style={styles.whyBody}>{why}</Text>
        </View>
      </View>

      <Button
        label={isDone ? "Completed today" : "Start challenge"}
        icon={isDone ? "checkmark-circle" : undefined}
        disabled={isDone}
        onPress={() => router.push({ pathname: "/checkin", params: { id } })}
      />

      {!isDone && (
        <>
          <Text style={styles.notNow}>Not right now?</Text>
          <View style={styles.options}>
            {shownOptions.map((option) => (
              <Pressable
                key={option.label}
                onPress={() => router.navigate({ pathname: option.pathname, params: { id } })}
                accessibilityRole="button"
                accessibilityLabel={option.label}
                style={({ pressed }) => [styles.option, pressed && styles.pressed]}
              >
                <Ionicons name={option.icon} size={20} color={colours.text} />
                <Text style={styles.optionText}>{option.label}</Text>
              </Pressable>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colours.bg,
  },
  content: {
    padding: sizes.screenPadding,
    paddingTop: 0,
    gap: space.md,
  },
  photo: {
    width: "100%",
    height: 230,
    borderRadius: radius.lg,
  },
  tags: {
    flexDirection: "row",
    gap: space.sm,
  },
  tag: {
    ...type.footnoteStrong,
    color: colours.text,
    paddingHorizontal: space.md,
    paddingVertical: space.xs,
    borderRadius: radius.pill,
    backgroundColor: colours.surface,
    overflow: "hidden",
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.xs,
    paddingHorizontal: space.md,
    paddingVertical: space.xs,
    borderRadius: radius.pill,
    backgroundColor: colours.surface,
  },
  tagText: {
    ...type.footnoteStrong,
    color: colours.text,
  },
  title: {
    ...type.title,
    color: colours.text,
  },
  label: {
    ...type.bodyStrong,
    color: colours.text,
  },
  step: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
  },
  stepNumber: {
    ...type.captionStrong,
    width: 24,
    height: 24,
    lineHeight: 24,
    borderRadius: 12,
    overflow: "hidden",
    textAlign: "center",
    color: colours.text,
    backgroundColor: colours.surface,
  },
  stepText: {
    ...type.body,
    color: colours.text,
    flex: 1,
  },
  why: {
    flexDirection: "row",
    gap: space.sm,
    padding: space.lg,
    borderRadius: radius.md,
    backgroundColor: colours.surface,
  },
  whyText: {
    flex: 1,
    gap: space.xxs,
  },
  whyTitle: {
    ...type.calloutStrong,
    color: colours.text,
  },
  whyBody: {
    ...type.callout,
    color: colours.muted,
  },
  notNow: {
    ...type.footnote,
    color: colours.muted,
  },
  options: {
    flexDirection: "row",
    gap: space.sm,
  },
  option: {
    flex: 1,
    minHeight: 76,
    padding: space.sm,
    alignItems: "center",
    justifyContent: "center",
    gap: space.xs,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colours.line,
    backgroundColor: colours.surface,
  },
  optionText: {
    ...type.captionStrong,
    color: colours.text,
    textAlign: "center",
  },
  pressed: {
    opacity: 0.6,
  },
});
