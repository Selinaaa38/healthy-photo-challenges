import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProgressBar } from "../../components/ProgressBar";
import { colours, radius, sizes, space, type } from "../../constants/theme";
import { plantsPerWorld, worlds } from "../../data/seed";
import DataService from "../../services/DataService";
import { AppData, Theme } from "../../types";

// Each theme draws the garden with its own icon.
const themes = [
  { name: "Garden", icon: "leaf" },
  { name: "Pets", icon: "paw" },
  { name: "Sanctuary", icon: "flower" },
] as const;

// My garden: plants grown, worlds unlocked and theme (US07).
export default function RewardsScreen() {
  const [data, setData] = useState<AppData>();

  useFocusEffect(
    useCallback(() => {
      DataService.getData().then(setData);
    }, []),
  );

  if (!data) return null;

  const chooseTheme = async (theme: Theme) => {
    const newData = await DataService.update((d) => {
      d.theme = theme;
    });
    setData(newData);
  };

  // A full world shows 12 of 12 until the next plant starts a new one
  const grown = data.plants % plantsPerWorld || (data.plants > 0 ? plantsPerWorld : 0);
  const toGo = plantsPerWorld - grown;
  // A new world unlocks every 12 plants
  const unlocked = Math.min(Math.floor(data.plants / plantsPerWorld) + 1, worlds.length);
  const icon = themes.find((t) => t.name === data.theme)!.icon;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title} accessibilityRole="header">
          My garden
        </Text>

        {/* The garden: grown plants in green, the newest in black, the rest faint */}
        <View
          style={styles.garden}
          accessible
          accessibilityLabel={`Your ${data.theme.toLowerCase()} with ${grown} of ${plantsPerWorld} plants`}
        >
          <View style={styles.plants}>
            {Array.from({ length: plantsPerWorld }, (_, index) => {
              const isGrown = index < grown;
              const isNewest = index === grown - 1;
              return (
                <Ionicons
                  key={index}
                  name={isGrown ? icon : `${icon}-outline`}
                  size={isGrown ? 24 + (index % 3) * 4 : 18}
                  color={isNewest ? colours.text : isGrown ? colours.success : colours.line}
                />
              );
            })}
          </View>
          <View style={styles.ground} />
        </View>

        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>
            {grown} of {plantsPerWorld} plants grown
          </Text>
          <Text style={styles.toGo}>{toGo > 0 ? `${toGo} to go` : "World complete"}</Text>
        </View>
        <ProgressBar value={grown} total={plantsPerWorld} highlightLatest />
        <Text style={styles.note}>Skipping never removes plants.</Text>

        <Text style={styles.sectionTitle} accessibilityRole="header">
          Theme
        </Text>
        <View style={styles.themes} accessibilityRole="radiogroup">
          {themes.map((theme) => {
            const inUse = data.theme === theme.name;
            return (
              <Pressable
                key={theme.name}
                onPress={() => chooseTheme(theme.name)}
                accessibilityRole="radio"
                accessibilityLabel={`${theme.name} theme`}
                accessibilityState={{ checked: inUse }}
                style={[styles.theme, inUse && styles.themeInUse]}
              >
                <Ionicons
                  name={`${theme.icon}-outline`}
                  size={24}
                  color={inUse ? colours.onPrimary : colours.text}
                />
                <Text style={[styles.themeName, inUse && styles.textInUse]}>{theme.name}</Text>
                <Text style={[styles.themeStatus, inUse && styles.statusInUse]}>
                  {inUse ? "In use" : "Switch"}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.worlds} accessible>
          <Ionicons name="sparkles-outline" size={22} color={colours.accent} />
          <View style={styles.worldsText}>
            <Text style={styles.worldsTitle}>
              Worlds unlocked: {unlocked} of {worlds.length}
            </Text>
            <Text style={styles.worldsDetail}>
              {worlds[unlocked - 1]}
              {unlocked < worlds.length ? ` · next: ${worlds[unlocked]}` : " · all unlocked"}
            </Text>
          </View>
        </View>
      </ScrollView>
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
    gap: space.md,
  },
  title: {
    ...type.largeTitle,
    color: colours.text,
  },
  garden: {
    height: 180,
    justifyContent: "flex-end",
    borderRadius: radius.xl,
    overflow: "hidden",
    backgroundColor: colours.surface,
  },
  plants: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-evenly",
    paddingHorizontal: space.sm,
    paddingBottom: space.sm,
  },
  ground: {
    height: 40,
    backgroundColor: colours.successTint,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: space.sm,
  },
  progressTitle: {
    ...type.bodyStrong,
    color: colours.text,
  },
  toGo: {
    ...type.footnote,
    color: colours.muted,
  },
  note: {
    ...type.footnote,
    color: colours.muted,
  },
  sectionTitle: {
    ...type.sectionTitle,
    color: colours.text,
    marginTop: space.md,
  },
  themes: {
    flexDirection: "row",
    gap: space.sm,
  },
  theme: {
    flex: 1,
    minHeight: 92,
    alignItems: "center",
    justifyContent: "center",
    gap: space.xxs,
    borderRadius: radius.lg,
    backgroundColor: colours.surface,
  },
  themeInUse: {
    backgroundColor: colours.primary,
  },
  themeName: {
    ...type.bodyStrong,
    color: colours.text,
  },
  textInUse: {
    color: colours.onPrimary,
  },
  themeStatus: {
    ...type.caption,
    color: colours.muted,
  },
  statusInUse: {
    color: colours.onImageMuted,
  },
  worlds: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.lg,
    borderRadius: radius.lg,
    backgroundColor: colours.surface,
  },
  worldsText: {
    flex: 1,
    gap: space.xxs,
  },
  worldsTitle: {
    ...type.bodyStrong,
    color: colours.text,
  },
  worldsDetail: {
    ...type.footnote,
    color: colours.muted,
  },
});
