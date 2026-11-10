import { Ionicons } from "@react-native-vector-icons/ionicons";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colours, type } from "../constants/theme";

// One everyday challenge in the Today list
type ChallengeRowProps = {
  title: string;
  minutes: number;
  goal: string;
  image?: ImageSourcePropType;
  onPress: () => void;
};

export function ChallengeRow({
  title,
  minutes,
  goal,
  image,
  onPress,
}: ChallengeRowProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}, about ${minutes} minutes, ${goal}`}
      accessibilityHint="Opens the challenge details"
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      {image ? (
        <Image source={image} style={styles.thumbnail} />
      ) : (
        <View style={styles.thumbnail} />
      )}
      <View style={styles.text}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.meta}>
          ~{minutes} min · {goal}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colours.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    minHeight: 56,
  },
  pressed: {
    opacity: 0.6,
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: colours.placeholder,
  },
  text: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colours.text,
  },
  meta: {
    ...type.footnote,
    color: colours.muted,
  },
});

