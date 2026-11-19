import { StyleSheet, View } from "react-native";
import { colours } from "../constants/theme";

type ProgressBarProps = {
  value: number;
  total: number;
  highlightLatest?: boolean;
};

// Reusable progress bar
export function ProgressBar({
  value,
  total,
  highlightLatest = false,
}: ProgressBarProps) {
  const segments = Array.from({ length: total }, (_, index) => index);

  return (
    <View
      style={styles.bar}
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityLabel={`${value} of ${total} plants grown`}
      accessibilityValue={{ min: 0, max: total, now: value }}
    >
      {segments.map((index) => {
        const filled = index < value;
        const isLatest = highlightLatest && index === value - 1;
        return (
          <View
            key={index}
            style={[
              styles.segment,
              filled && styles.filled,
              isLatest && styles.latest,
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    gap: 4,
  },
  segment: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: colours.line,
  },
  filled: {
    backgroundColor: colours.success,
  },
  latest: {
    backgroundColor: colours.primary,
  },
});
