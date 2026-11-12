import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colours, radius, sizes, space, type } from "../constants/theme";
import { excludeOptions, goalOptions, interestOptions, minuteOptions } from "../data/seed";
import { Goal, Minutes, Preferences } from "../types";
import { Button } from "./Button";
import { Chip } from "./Chip";

// Figma 02 Preferences form, shared by onboarding and Profile (US02).

type PreferencesFormProps = {
  initial: Preferences | null;
  saveLabel: string;
  onSave: (prefs: Preferences) => void;
  onSkip?: () => void; // onboarding only
};

// Adds the item if it isn't in the list, otherwise removes it.
const toggle = <T,>(list: T[], item: T) =>
  list.includes(item) ? list.filter((i) => i !== item) : [...list, item];

export function PreferencesForm({ initial, saveLabel, onSave, onSkip }: PreferencesFormProps) {
  const [goals, setGoals] = useState<Goal[]>(initial?.goals ?? []);
  const [interests, setInterests] = useState<string[]>(initial?.interests ?? []);
  const [excluded, setExcluded] = useState<string[]>(initial?.excluded ?? []);
  const [minutes, setMinutes] = useState<Minutes>(initial?.minutes ?? 10);

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      {/* "automatic" moves the content below the see-through iOS header */}
      <ScrollView
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
      >
        <Text style={styles.title} accessibilityRole="header">
          What would help most?
        </Text>
        <Text style={styles.subtitle}>Tap all that apply. Edit anytime in Profile.</Text>

        <Text style={styles.label}>Wellbeing goals</Text>
        <View style={styles.chips}>
          {goalOptions.map((goal) => (
            <Chip
              key={goal}
              label={goal}
              state={goals.includes(goal) ? "selected" : "default"}
              onPress={() => setGoals(toggle(goals, goal))}
            />
          ))}
        </View>

        <Text style={styles.label}>I enjoy</Text>
        <View style={styles.chips}>
          {interestOptions.map((activity) => (
            <Chip
              key={activity}
              label={activity}
              state={interests.includes(activity) ? "selected" : "default"}
              onPress={() => setInterests(toggle(interests, activity))}
            />
          ))}
        </View>

        <Text style={styles.label}>Never suggest</Text>
        <Text style={styles.helper}>Selected activities won't appear in your challenges.</Text>
        <View style={styles.chips}>
          {excludeOptions.map((activity) => (
            <Chip
              key={activity}
              label={activity}
              // B2: excluded chips look different from chosen ones
              state={excluded.includes(activity) ? "excluded" : "default"}
              accessibilityHint="Stops this activity appearing in your challenges"
              onPress={() => setExcluded(toggle(excluded, activity))}
            />
          ))}
        </View>

        <Text style={styles.label}>How long per challenge?</Text>
        <View style={styles.segmented} accessibilityRole="radiogroup">
          {minuteOptions.map((option) => {
            const isSelected = minutes === option;
            return (
              <Pressable
                key={option}
                onPress={() => setMinutes(option)}
                accessibilityRole="radio"
                accessibilityLabel={`About ${option} minutes`}
                accessibilityState={{ checked: isSelected }}
                style={[styles.segment, isSelected && styles.segmentSelected]}
              >
                <Text style={[styles.segmentLabel, isSelected && styles.segmentLabelSelected]}>
                  ~{option} min
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <Button
          label={saveLabel}
          onPress={() => onSave({ goals, interests, excluded, minutes })}
        />
        {onSkip && <Button label="Skip for now" variant="text" onPress={onSkip} />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colours.bg,
  },
  content: {
    padding: sizes.screenPadding,
  },
  title: {
    ...type.title,
    color: colours.text,
  },
  subtitle: {
    ...type.callout,
    color: colours.muted,
    marginTop: space.sm,
  },
  label: {
    ...type.bodyStrong,
    color: colours.text,
    marginTop: space.xl,
    marginBottom: space.md,
  },
  helper: {
    ...type.footnote,
    color: colours.muted,
    marginTop: -space.sm,
    marginBottom: space.md,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space.sm,
  },
  segmented: {
    flexDirection: "row",
    padding: space.xs,
    borderRadius: radius.pill,
    backgroundColor: colours.surface,
    borderWidth: 1,
    borderColor: colours.line,
  },
  segment: {
    flex: 1,
    minHeight: sizes.minTouch,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentSelected: {
    backgroundColor: colours.primary,
  },
  segmentLabel: {
    ...type.bodyMedium,
    color: colours.text,
  },
  segmentLabelSelected: {
    color: colours.onPrimary,
  },
  actions: {
    paddingHorizontal: sizes.screenPadding,
    paddingTop: space.md,
    gap: space.xs,
  },
});
