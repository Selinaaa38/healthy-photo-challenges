import { Ionicons } from "@react-native-vector-icons/ionicons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../../components/Button";
import { colours, radius, sizes, space, type } from "../../../constants/theme";
import DataService, { getChallenge } from "../../../services/DataService";
import { AppData, Audience, CheckIn } from "../../../types";
import { formatWhen } from "../../../utils/time";

export default function ProfileScreen() {
  const [data, setData] = useState<AppData>();

  // Refresh profile data
  useFocusEffect(
    useCallback(() => {
      DataService.getData().then(setData);
    }, []),
  );

  if (!data) return null;

  const prefs = data.preferences;

  // Show selected audience name
  const audienceName = (audience: Audience) =>
    audience === "private"
      ? "Private"
      : (data.circles.find((c) => c.id === audience)?.name ?? "a circle you left");

  //Save Daily Special alert preference
  const setAlerts = async (on: boolean) => {
    const newData = await DataService.update((d) => {
      d.specialAlerts = on;
    });
    setData(newData);
  };

  // Allow users t change sharing permissions / delete check-ins
  const showOptions = (checkIn: CheckIn) => {
    const shared = audienceName(checkIn.audience);
    Alert.alert(
      getChallenge(checkIn.challengeId).title,
      `${formatWhen(checkIn.createdAt)} · ${checkIn.audience === "private" ? "Private" : `Shared with ${shared}`}`,
      [
        { text: "Change who can see this", onPress: () => chooseAudience(checkIn) },
        { text: "Delete check-in", style: "destructive", onPress: () => confirmDelete(checkIn) },
        { text: "Cancel", style: "cancel" },
      ],
    );
  };

  // Update check-in visibility
  const chooseAudience = (checkIn: CheckIn) => {
    const options: Audience[] = ["private", ...data.circles.map((c) => c.id)];
    Alert.alert("Who can see this?", `Currently: ${audienceName(checkIn.audience)}`, [
      ...options.map((audience) => ({
        text: audienceName(audience),
        onPress: async () => setData(await DataService.changeAudience(checkIn.id, audience)),
      })),
      { text: "Cancel", style: "cancel" as const },
    ]);
  };

  // Confirm deletion but retain plants and progress
  const confirmDelete = (checkIn: CheckIn) => {
    const shared = checkIn.audience !== "private";
    Alert.alert(
      "Delete this check-in?",
      `${shared ? `The photo will be removed for everyone in ${audienceName(checkIn.audience)}. ` : ""}Your plant and progress are kept.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete check-in",
          style: "destructive",
          onPress: async () => setData(await DataService.deleteCheckIn(checkIn.id)),
        },
      ],
    );
  };

  // Clear demo data and return to onboarding 
  const confirmReset = () => {
    Alert.alert("Reset demo data?", "This deletes your check-ins and settings.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: async () => {
          await DataService.clear();
          router.replace("/onboarding");
        },
      },
    ]);
  };

  const rows = prefs
    ? [
        ["Goals", prefs.goals.join(", ") || "Any"],
        ["Enjoys", prefs.interests.join(", ") || "Anything"],
        ["Avoid", prefs.excluded.join(", ") || "Nothing"],
        ["Length", `~${prefs.minutes} min`],
      ]
    : [];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitial}>{data.userName[0]}</Text>
          </View>
          <View>
            <Text style={styles.name} accessibilityRole="header">
              {data.userName}
            </Text>
            <Text style={styles.stats}>
              {`${data.checkIns.length} ${data.checkIns.length === 1 ? "challenge" : "challenges"} completed · ${data.plants} plants`}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>My preferences</Text>
            <Button
              label={prefs ? "Edit" : "Set"}
              variant="secondary"
              accessibilityHint="Opens your preferences"
              onPress={() => router.navigate("/profile/preferences")}
              style={styles.editButton}
            />
          </View>
          {prefs ? (
            rows.map(([label, value]) => (
              <View key={label} style={styles.prefRow} accessible>
                <Text style={styles.prefLabel}>{label}</Text>
                <Text style={styles.prefValue}>{value}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.muted}>Not set yet, so you get general challenges.</Text>
          )}
        </View>

        <View style={[styles.card, styles.alerts]}>
          <Ionicons name="notifications-outline" size={22} color={colours.text} />
          <View style={styles.alertsText}>
            <Text style={styles.cardTitle}>Daily Special alerts</Text>
            <Text style={styles.muted}>One notification when it's released</Text>
          </View>
          <Switch
            value={data.specialAlerts}
            onValueChange={setAlerts}
            trackColor={{ true: colours.success }}
            accessibilityLabel="Daily Special alerts"
          />
        </View>

        <Text style={styles.sectionLabel}>My check-ins</Text>
        {data.checkIns.length === 0 ? (
          <Text style={styles.muted}>No check-ins yet. Complete a challenge to see it here.</Text>
        ) : (
          <View style={styles.grid}>
            {data.checkIns.map((checkIn) => (
              <View key={checkIn.id} style={styles.tile}>
                <Image
                  source={{ uri: checkIn.photoUri }}
                  style={styles.tileImage}
                  accessibilityLabel={`${getChallenge(checkIn.challengeId).title}, ${audienceName(checkIn.audience)}`}
                />
                <View style={[styles.badge, styles.badgeLeft]}>
                  <Ionicons
                    name={checkIn.audience === "private" ? "lock-closed" : "people"}
                    size={12}
                    color={colours.text}
                  />
                </View>
                <Pressable
                  onPress={() => showOptions(checkIn)}
                  accessibilityRole="button"
                  accessibilityLabel="Check-in options"
                  hitSlop={10}
                  style={[styles.badge, styles.badgeRight]}
                >
                  <Ionicons name="ellipsis-horizontal" size={14} color={colours.text} />
                </Pressable>
              </View>
            ))}
          </View>
        )}

        <Button label="Reset demo data" variant="text" onPress={confirmReset} />
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
    gap: space.lg,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colours.placeholder,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    ...type.title,
    color: colours.muted,
  },
  name: {
    ...type.title,
    color: colours.text,
  },
  stats: {
    ...type.footnote,
    color: colours.muted,
  },
  card: {
    gap: space.sm,
    padding: space.lg,
    borderRadius: radius.lg,
    backgroundColor: colours.surface,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: {
    ...type.bodyStrong,
    color: colours.text,
  },
  editButton: {
    minHeight: 36,
    paddingHorizontal: space.lg,
  },
  prefRow: {
    flexDirection: "row",
  },
  prefLabel: {
    ...type.callout,
    color: colours.muted,
    width: 80,
  },
  prefValue: {
    ...type.calloutStrong,
    color: colours.text,
    flex: 1,
  },
  muted: {
    ...type.callout,
    color: colours.muted,
  },
  alerts: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
  },
  alertsText: {
    flex: 1,
  },
  sectionLabel: {
    ...type.footnoteStrong,
    color: colours.muted,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space.sm,
  },
  tile: {
    width: "31.5%",
    aspectRatio: 3 / 4,
    borderRadius: radius.md,
    overflow: "hidden",
    backgroundColor: colours.placeholder,
  },
  tileImage: {
    width: "100%",
    height: "100%",
  },
  badge: {
    position: "absolute",
    top: space.sm,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colours.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeLeft: {
    left: space.sm,
  },
  badgeRight: {
    right: space.sm,
  },
});
