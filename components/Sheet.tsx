import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colours, sizes, space, type } from "../constants/theme";

// Layout shared by the "Not right now?" sheets
// title, subtitle, then the sheet's own content and buttons.
type SheetProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function Sheet({ title, subtitle, children }: SheetProps) {
  return (
    <View style={styles.sheet}>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    padding: sizes.screenPadding,
    paddingTop: space.xxl,
    paddingBottom: space.xxxl,
    gap: space.md,
    backgroundColor: colours.bg,
  },
  title: {
    ...type.headline,
    color: colours.text,
  },
  subtitle: {
    ...type.callout,
    color: colours.muted,
  },
});
