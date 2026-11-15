import { Ionicons } from "@react-native-vector-icons/ionicons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../../components/Button";
import { colours, radius, sizes, space, type } from "../../../constants/theme";
import DataService, { describeMembers } from "../../../services/DataService";
import { AppData } from "../../../types";

// Circles: invitations to accept or decline (US13) and your circles.
export default function CirclesScreen() {
  const [data, setData] = useState<AppData>();

  useFocusEffect(
    useCallback(() => {
      DataService.getData().then(setData);
    }, []),
  );

  if (!data) return null;

  const answer = async (invitationId: string, accept: boolean) => {
    setData(await DataService.answerInvitation(invitationId, accept));
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} accessibilityRole="header">
            Circles
          </Text>
          <Button
            label="New circle"
            icon="add"
            onPress={() => router.navigate("/circles/create")}
            style={styles.newButton}
          />
        </View>

        {data.invitations.length > 0 && <Text style={styles.label}>Invitations</Text>}
        {data.invitations.map((invitation) => (
          <View key={invitation.id} style={styles.card}>
            <View style={styles.row}>
              <View style={styles.avatar}>
                <Text style={styles.initial}>{invitation.inviter[0]}</Text>
              </View>
              <View style={styles.rowText}>
                <Text style={styles.name}>
                  {invitation.inviter} invited you to {invitation.circleName}
                </Text>
                <Text style={styles.detail}>{invitation.members.length} members</Text>
              </View>
            </View>
            {/* Explains what joining shares before deciding (US13) */}
            <View style={styles.info}>
              <Ionicons name="information-circle-outline" size={16} color={colours.muted} />
              <Text style={styles.infoText}>
                Joining lets you see and share posts in {invitation.circleName}. Your private
                check-ins stay private.
              </Text>
            </View>
            <View style={styles.buttons}>
              <Button
                label="Decline"
                variant="secondary"
                onPress={() => answer(invitation.id, false)}
                style={styles.flex}
              />
              <Button
                label="Accept"
                onPress={() => answer(invitation.id, true)}
                style={styles.flex}
              />
            </View>
          </View>
        ))}

        <Text style={styles.label}>My circles</Text>
        {data.circles.map((circle) => {
          const others = circle.members.filter((name) => name !== "You").slice(0, 3);
          const pending = circle.pending.length;
          const detail = `${describeMembers(circle)}${
            pending ? ` · ${pending} pending invite${pending > 1 ? "s" : ""}` : ""
          }`;
          return (
            <Pressable
              key={circle.id}
              onPress={() => router.navigate({ pathname: "/circles/feed", params: { id: circle.id } })}
              accessibilityRole="button"
              accessibilityLabel={`${circle.name}, ${detail}`}
              accessibilityHint="Opens the circle feed"
              style={({ pressed }) => [styles.card, styles.row, pressed && styles.pressed]}
            >
              <View style={styles.avatars}>
                {others.map((name, index) => (
                  <View key={name} style={[styles.avatar, index > 0 && styles.overlap]}>
                    <Text style={styles.initial}>{name[0]}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.rowText}>
                <Text style={styles.name}>{circle.name}</Text>
                <Text style={styles.detail}>{detail}</Text>
              </View>
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
    gap: space.md,
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
  newButton: {
    minHeight: sizes.minTouch,
    paddingHorizontal: space.lg,
  },
  label: {
    ...type.footnoteStrong,
    color: colours.muted,
    marginTop: space.sm,
  },
  card: {
    gap: space.md,
    padding: space.lg,
    borderRadius: radius.lg,
    backgroundColor: colours.surface,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
  },
  rowText: {
    flex: 1,
    gap: space.xxs,
  },
  name: {
    ...type.bodyStrong,
    color: colours.text,
  },
  detail: {
    ...type.footnote,
    color: colours.muted,
  },
  avatars: {
    flexDirection: "row",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colours.surface,
    backgroundColor: colours.elevated,
    alignItems: "center",
    justifyContent: "center",
  },
  overlap: {
    marginLeft: -14,
  },
  initial: {
    ...type.calloutStrong,
    color: colours.muted,
  },
  info: {
    flexDirection: "row",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
    backgroundColor: colours.elevated,
  },
  infoText: {
    ...type.footnote,
    color: colours.muted,
    flex: 1,
  },
  buttons: {
    flexDirection: "row",
    gap: space.sm,
  },
  flex: {
    flex: 1,
  },
  pressed: {
    opacity: 0.6,
  },
});
