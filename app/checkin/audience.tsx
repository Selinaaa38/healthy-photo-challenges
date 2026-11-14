import { Ionicons } from "@react-native-vector-icons/ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "../../components/Button";
import { colours, radius, sizes, space, type } from "../../constants/theme";
import DataService, { getChallenge } from "../../services/DataService";
import { Audience, Circle } from "../../types";

// Labelling conventions for circles
const describe = (circle: Circle) =>
  circle.members.length <= 4
    ? `${circle.members.slice(0, -1).join(", ")} and ${circle.members.at(-1)}`
    : `${circle.members.length} people`;

// Choose who sees the check-in. Private is the default, and the
// button names the choice (US05). Completing adds one plant (US07).
export default function AudienceScreen() {
  const { id, photo, selfie, caption } = useLocalSearchParams<{
    id: string;
    photo: string;
    selfie?: string;
    caption: string;
  }>();
  const [circles, setCircles] = useState<Circle[]>([]);
  const [audience, setAudience] = useState<Audience>("private");

  useEffect(() => {
    DataService.getData().then((data) => setCircles(data.circles));
  }, []);

  const options = [
    { id: "private", name: "Private", detail: "Only you can see this", icon: "lock-closed-outline" as const },
    ...circles.map((c) => ({ id: c.id, name: c.name, detail: describe(c), icon: "people-outline" as const })),
  ];
  const chosen = options.find((o) => o.id === audience)!;

  const share = async () => {
    await DataService.completeChallenge(id, photo, selfie, caption, audience);
    router.replace("/checkin/complete");
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
    >
      <Text style={styles.step}>Step 2 of 2 · Choose who sees it</Text>

      <View style={styles.summary} accessible>
        <Image source={{ uri: photo }} style={styles.thumbnail} />
        <View style={styles.summaryText}>
          <Text style={styles.summaryTitle}>{getChallenge(id).title}</Text>
          {caption ? <Text style={styles.summaryCaption}>“{caption}”</Text> : null}
        </View>
      </View>

      <View style={styles.options} accessibilityRole="radiogroup">
        {options.map((option) => {
          const isSelected = audience === option.id;
          return (
            <Pressable
              key={option.id}
              onPress={() => setAudience(option.id)}
              accessibilityRole="radio"
              accessibilityLabel={`${option.name}, ${option.detail}`}
              accessibilityState={{ checked: isSelected }}
              style={[styles.option, isSelected && styles.optionSelected]}
            >
              <Ionicons name={option.icon} size={22} color={isSelected ? colours.onPrimary : colours.text} />
              <View style={styles.optionText}>
                <Text style={[styles.optionName, isSelected && styles.textSelected]}>{option.name}</Text>
                <Text style={[styles.optionDetail, isSelected && styles.detailSelected]}>
                  {option.detail}
                </Text>
              </View>
              <Ionicons
                name={isSelected ? "checkmark-circle" : "ellipse-outline"}
                size={24}
                color={isSelected ? colours.onPrimary : colours.muted}
              />
            </Pressable>
          );
        })}
      </View>

      <View style={styles.note}>
        <Ionicons name="leaf" size={14} color={colours.success} />
        <Text style={styles.noteText}>
          Private and shared check-ins earn the same reward. Private is the default.
        </Text>
      </View>

      <Button
        label={audience === "private" ? "Share privately" : `Share with ${chosen.name}`}
        onPress={share}
      />
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
    gap: space.md,
  },
  step: {
    ...type.overline,
    color: colours.muted,
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
    backgroundColor: colours.surface,
  },
  thumbnail: {
    width: 52,
    height: 52,
    borderRadius: radius.sm,
    backgroundColor: colours.placeholder,
  },
  summaryText: {
    flex: 1,
    gap: space.xxs,
  },
  summaryTitle: {
    ...type.bodyStrong,
    color: colours.text,
  },
  summaryCaption: {
    ...type.footnote,
    color: colours.muted,
  },
  options: {
    gap: space.sm,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    minHeight: 64,
    paddingHorizontal: space.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colours.line,
    backgroundColor: colours.surface,
  },
  optionSelected: {
    backgroundColor: colours.primary,
    borderColor: colours.primary,
  },
  optionText: {
    flex: 1,
  },
  optionName: {
    ...type.bodyStrong,
    color: colours.text,
  },
  optionDetail: {
    ...type.footnote,
    color: colours.muted,
  },
  textSelected: {
    color: colours.onPrimary,
  },
  detailSelected: {
    color: colours.onImageMuted,
  },
  note: {
    flexDirection: "row",
    gap: space.sm,
  },
  noteText: {
    ...type.footnote,
    color: colours.muted,
    flex: 1,
  },
});
