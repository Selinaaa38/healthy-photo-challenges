import { Ionicons } from "@react-native-vector-icons/ionicons";
import { Pressable, StyleSheet, Text } from "react-native";
import { colours, radius, space, type } from "../constants/theme";

// Selectable chip for the preferences screen (goals, interests, never suggest,
// skip reasons). Built on Pressable.
// States:
//   default  - grey chip, not chosen
//   selected - black chip with a tick ("Move", "Walking")
//   excluded - red outline, cross and struck-through label (beta change B2)
export type ChipState = "default" | "selected" | "excluded";

type ChipProps = {
  label: string;
  state: ChipState;
  onPress: () => void;
  accessibilityHint?: string;
};

export function Chip({ label, state, onPress, accessibilityHint }: ChipProps) {
  const isSelected = state === "selected";
  const isExcluded = state === "excluded";

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      // VoiceOver reads the state and the name, e.g. "Running, excluded"
      accessibilityLabel={isExcluded ? `${label}, excluded` : label}
      accessibilityState={{ selected: isSelected || isExcluded }}
      accessibilityHint={accessibilityHint}
      // The chip is drawn 38 pt tall. The touch area is
      // extended to the 44 pt accessibility minimum.
      hitSlop={{ top: 3, bottom: 3 }}
      style={({ pressed }) => [
        styles.chip,
        isSelected && styles.selected,
        isExcluded && styles.excluded,
        pressed && styles.pressed,
      ]}
    >
      {isSelected && (
        <Ionicons name="checkmark" size={16} color={colours.onPrimary} />
      )}
      {isExcluded && <Ionicons name="close" size={16} color={colours.error} />}
      <Text
        style={[
          styles.label,
          isSelected && styles.selectedLabel,
          isExcluded && styles.excludedLabel,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 38,
    paddingHorizontal: space.lg,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colours.line,
    backgroundColor: colours.surface,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: space.xs,
  },
  selected: {
    backgroundColor: colours.primary,
    borderColor: colours.primary,
  },
  excluded: {
    backgroundColor: colours.errorTint,
    borderColor: colours.error,
  },
  pressed: {
    opacity: 0.6,
  },
  label: {
    ...type.bodyMedium,
    color: colours.text,
  },
  selectedLabel: {
    color: colours.onPrimary,
  },
  excludedLabel: {
    color: colours.error,
    textDecorationLine: "line-through",
  },
});
