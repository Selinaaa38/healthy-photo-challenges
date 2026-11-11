import { Ionicons } from "@react-native-vector-icons/ionicons";
import { ComponentProps } from "react";
import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from "react-native";
import { colours, radius, sizes, space, type } from "../constants/theme";

// Reusable button, built on Pressable
//   primary     - black pill, white text ("Start challenge", "Share privately")
//   secondary   - outlined pill ("Explore first", "Decline")
//   text        - no background ("Skip for now", "Keep original", "Cancel")
//   destructive - red pill ("Delete check-in")
//   light       - white pill, for dark photos ("Set my preferences")
//   outlineLight - white outline, for dark photos ("Explore first")
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "text"
  | "destructive"
  | "light"
  | "outlineLight";

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: ComponentProps<typeof Ionicons>["name"];
  disabled?: boolean;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  onPress,
  variant = "primary",
  icon,
  disabled = false,
  accessibilityHint,
  style,
}: ButtonProps) {
  const textColour = textColours[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {icon && <Ionicons name={icon} size={18} color={textColour} />}
      <Text style={[styles.label, { color: textColour }]}>{label}</Text>
    </Pressable>
  );
}

const textColours: Record<ButtonVariant, string> = {
  primary: colours.onPrimary,
  secondary: colours.text,
  text: colours.text,
  destructive: colours.onPrimary,
  light: colours.text,
  outlineLight: colours.onPrimary,
};

const styles = StyleSheet.create({
  base: {
    minHeight: sizes.button,
    paddingHorizontal: space.xl,
    borderRadius: radius.pill,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: space.sm,
  },
  label: {
    ...type.button,
  },
  pressed: {
    opacity: 0.6,
  },
  disabled: {
    opacity: 0.35,
  },
});

const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: colours.primary,
  },
  secondary: {
    backgroundColor: colours.bg,
    borderWidth: 1.5,
    borderColor: colours.line,
  },
  text: {
    backgroundColor: "transparent",
    minHeight: sizes.minTouch,
  },
  destructive: {
    backgroundColor: colours.error,
  },
  light: {
    backgroundColor: colours.bg,
  },
  outlineLight: {
    borderWidth: 1.5,
    borderColor: colours.onPrimary,
  },
});
