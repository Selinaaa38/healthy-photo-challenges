import { Ionicons } from "@react-native-vector-icons/ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Button } from "../../../components/Button";
import { Sheet } from "../../../components/Sheet";
import { colours, radius, sizes, space, type } from "../../../constants/theme";
import DataService, { getAlternative } from "../../../services/DataService";
import { AppData } from "../../../types";

const kinds = [
  { kind: "easier", label: "Something easier", icon: "leaf-outline" },
  { kind: "different", label: "Different activity", icon: "shuffle-outline" },
] as const;

// Swap for an easier or different challenge (US08).
// Nothing changes until "Use this instead" is tapped.
export default function EasierSheet() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [data, setData] = useState<AppData>();
  const [kind, setKind] = useState<"easier" | "different">("easier");

  useEffect(() => {
    DataService.getData().then(setData);
  }, []);

  if (!data) return null;
  const alternative = getAlternative(id, kind, data);

  const useAlternative = async () => {
    await DataService.swapChallenge(id, alternative!.id);
    router.dismissTo("/today");
  };

  return (
    <Sheet title="Try something else?" subtitle="Your original challenge stays until you confirm.">
      <View style={styles.segmented} accessibilityRole="radiogroup">
        {kinds.map((option) => {
          const isSelected = kind === option.kind;
          return (
            <Pressable
              key={option.kind}
              onPress={() => setKind(option.kind)}
              accessibilityRole="radio"
              accessibilityLabel={option.label}
              accessibilityState={{ checked: isSelected }}
              style={[styles.segment, isSelected && styles.segmentSelected]}
            >
              <Ionicons
                name={option.icon}
                size={16}
                color={isSelected ? colours.onPrimary : colours.text}
              />
              <Text style={[styles.segmentLabel, isSelected && styles.segmentLabelSelected]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.preview} accessible>
        {alternative ? (
          <>
            <Image source={alternative.image} style={styles.thumbnail} />
            <View style={styles.previewText}>
              <Text style={styles.overline}>Preview</Text>
              <Text style={styles.previewTitle}>{alternative.title}</Text>
              <Text style={styles.previewMeta}>
                ~{alternative.minutes} min · {alternative.goal}
              </Text>
            </View>
          </>
        ) : (
          <Text style={styles.previewMeta}>No other option right now. Try the other tab.</Text>
        )}
      </View>

      <Button label="Use this instead" disabled={!alternative} onPress={useAlternative} />
      <Button label="Keep original" variant="text" onPress={() => router.back()} />
    </Sheet>
  );
}

const styles = StyleSheet.create({
  segmented: {
    flexDirection: "row",
    padding: space.xs,
    borderRadius: radius.pill,
    backgroundColor: colours.surface,
  },
  segment: {
    flex: 1,
    flexDirection: "row",
    minHeight: sizes.minTouch,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    gap: space.xs,
  },
  segmentSelected: {
    backgroundColor: colours.primary,
  },
  segmentLabel: {
    ...type.calloutStrong,
    color: colours.text,
  },
  segmentLabelSelected: {
    color: colours.onPrimary,
  },
  preview: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
    backgroundColor: colours.surface,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: radius.sm,
  },
  previewText: {
    flex: 1,
    gap: space.xxs,
  },
  overline: {
    ...type.overline,
    color: colours.muted,
  },
  previewTitle: {
    ...type.bodyStrong,
    color: colours.text,
  },
  previewMeta: {
    ...type.footnote,
    color: colours.muted,
  },
});
