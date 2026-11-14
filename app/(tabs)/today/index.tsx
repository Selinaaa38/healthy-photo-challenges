import { Ionicons } from "@react-native-vector-icons/ionicons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChallengeRow } from "../../../components/ChallengeRow";
import { colours, radius, sizes, space, type } from "../../../constants/theme";
import { dailySpecial, plantsPerWorld } from "../../../data/seed";
import DataService, { getChallenge } from "../../../services/DataService";
import { AppData } from "../../../types";
import { formatTime, formatWhen } from "../../../utils/time";

// Figma 03 Today: plants, Family check-ins, Daily Special and everyday
// challenges (US01, US03, US09, US14).
export default function TodayScreen() {
  const [data, setData] = useState<AppData>();

  useFocusEffect(
    useCallback(() => {
      DataService.getData().then(setData);
    }, []),
  );

  if (!data) return null;

  const openChallenge = (id: string) =>
    router.navigate({ pathname: "/today/detail", params: { id } });

  const special = getChallenge(dailySpecial.challengeId);
  const specialDone = data.tasks.some(
    (t) => t.challengeId === special.id && t.status === "completed",
  );
  const [hours, mins] = dailySpecial.closesAt.split(":").map(Number);
  const closesAt = formatTime(new Date(new Date().setHours(hours, mins)));

  const everyday = data.tasks.filter(
    (t) => t.challengeId !== special.id && t.status !== "scheduled",
  );
  const scheduled = data.tasks.filter((t) => t.status === "scheduled");

  // Who in Family has checked in (posted) so far.
  const family = data.circles.find((c) => c.id === "family");
  const posted = (name: string) =>
    name === "You"
      ? data.checkIns.some((c) => c.audience === "family")
      : data.posts.some((p) => p.circleId === "family" && p.author === name);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} accessibilityRole="header">
            Today
          </Text>
          <View style={styles.plants}>
            <Ionicons name="leaf" size={14} color={colours.success} />
            <Text style={styles.plantsText}>
              {data.plants % plantsPerWorld} of {plantsPerWorld} plants
            </Text>
          </View>
        </View>

        {family && (
          <Pressable
            onPress={() => router.navigate({ pathname: "/circles/feed", params: { id: family.id } })}
            accessibilityRole="button"
            accessibilityLabel={`Family today. Checked in: ${
              family.members.filter(posted).join(", ") || "nobody yet"
            }`}
            accessibilityHint="Opens the Family feed"
          >
            <Text style={styles.sectionLabel}>Family today</Text>
            <View style={styles.family}>
              {family.members.map((name) => (
                <View key={name} style={styles.member}>
                  <View
                    style={[
                      styles.avatar,
                      name === "You" && styles.avatarYou,
                      posted(name) && styles.avatarPosted,
                    ]}
                  >
                    <Text style={styles.initial}>{name[0]}</Text>
                  </View>
                  <Text style={styles.memberName}>{name === "You" ? "Your turn" : name}</Text>
                </View>
              ))}
            </View>
          </Pressable>
        )}

        <Pressable
          onPress={() => openChallenge(special.id)}
          accessibilityRole="button"
          accessibilityLabel={`Daily Special, optional: ${special.title}, about ${special.minutes} minutes, ${
            specialDone ? "done" : `closes ${closesAt}`
          }`}
          accessibilityHint="Opens the challenge details"
        >
          <ImageBackground source={special.image} style={styles.special}>
            <View style={[StyleSheet.absoluteFill, styles.overlay]} />
            <View style={styles.badges}>
              <View style={styles.badge}>
                <Ionicons name="star" size={14} color={colours.accentLight} />
                <Text style={styles.badgeText}>Daily Special (Optional)</Text>
              </View>
              <View style={styles.badge}>
                <Ionicons
                  name={specialDone ? "checkmark-circle" : "time-outline"}
                  size={14}
                  color={colours.accentLight}
                />
                <Text style={[styles.badgeText, styles.badgeAccent]}>
                  {specialDone ? "Done" : `Closes ${closesAt}`}
                </Text>
              </View>
            </View>
            <View>
              <Text style={styles.specialTitle}>{special.title}</Text>
              <Text style={styles.specialMeta}>
                ~{special.minutes} min · {special.goal} · Join others, or skip it
              </Text>
            </View>
          </ImageBackground>
        </Pressable>

        <Text style={styles.sectionTitle} accessibilityRole="header">
          Your everyday challenges
        </Text>
        <View style={styles.list}>
          {everyday.map((task) => {
            const challenge = getChallenge(task.challengeId);
            return (
              <ChallengeRow
                key={task.challengeId}
                title={challenge.title}
                minutes={challenge.minutes}
                goal={challenge.goal}
                image={challenge.image}
                status={
                  task.status === "completed" ? "Done" : task.status === "skipped" ? "Skipped" : undefined
                }
                onPress={() => openChallenge(challenge.id)}
              />
            );
          })}
        </View>

        {scheduled.map((task) => {
          const label = `Upcoming · ${getChallenge(task.challengeId).title}, ${formatWhen(task.scheduledFor!)}`;
          return (
            <Pressable
              key={task.challengeId}
              onPress={() => openChallenge(task.challengeId)}
              accessibilityRole="button"
              accessibilityLabel={label}
              style={({ pressed }) => [styles.upcoming, pressed && styles.pressed]}
            >
              <Ionicons name="time-outline" size={18} color={colours.text} />
              <Text style={styles.upcomingText}>{label}</Text>
              <Ionicons name="chevron-forward" size={18} color={colours.text} />
            </Pressable>
          );
        })}
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
    gap: space.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    ...type.largeTitle,
    color: colours.text,
  },
  plants: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.xs,
    paddingHorizontal: space.md,
    paddingVertical: space.xs,
    borderRadius: radius.pill,
    backgroundColor: colours.surface,
  },
  plantsText: {
    ...type.footnoteStrong,
    color: colours.text,
  },
  sectionLabel: {
    ...type.footnoteStrong,
    color: colours.muted,
    marginBottom: space.sm,
  },
  family: {
    flexDirection: "row",
    gap: space.lg,
  },
  member: {
    alignItems: "center",
    gap: space.xs,
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 2,
    borderColor: colours.line,
    backgroundColor: colours.placeholder,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarYou: {
    borderStyle: "dashed",
    borderColor: colours.text,
  },
  avatarPosted: {
    borderStyle: "solid",
    borderColor: colours.success,
  },
  initial: {
    ...type.headline,
    color: colours.muted,
  },
  memberName: {
    ...type.captionStrong,
    color: colours.text,
  },
  special: {
    height: 210,
    padding: space.lg,
    justifyContent: "space-between",
    borderRadius: radius.xl,
    overflow: "hidden",
    backgroundColor: colours.primary,
  },
  overlay: {
    backgroundColor: colours.overlay,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space.xs,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.xs,
    paddingHorizontal: space.md,
    paddingVertical: space.xs,
    borderRadius: radius.pill,
    backgroundColor: colours.overlayStrong,
  },
  badgeText: {
    ...type.footnoteStrong,
    color: colours.onPrimary,
  },
  badgeAccent: {
    color: colours.accentLight,
  },
  specialTitle: {
    ...type.headline,
    color: colours.onPrimary,
  },
  specialMeta: {
    ...type.footnote,
    color: colours.onImageMuted,
    marginTop: space.xxs,
  },
  sectionTitle: {
    ...type.sectionTitle,
    color: colours.text,
  },
  list: {
    gap: space.md,
  },
  upcoming: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    minHeight: sizes.minTouch,
    paddingHorizontal: space.lg,
    borderRadius: radius.md,
    backgroundColor: colours.surface,
  },
  upcomingText: {
    ...type.callout,
    color: colours.text,
    flex: 1,
  },
  pressed: {
    opacity: 0.6,
  },
});
