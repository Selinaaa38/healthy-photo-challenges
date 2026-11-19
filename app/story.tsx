import { Ionicons } from "@react-native-vector-icons/ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colours, radius, sizes, space, type } from "../constants/theme";
import { postImages } from "../data/seed";
import DataService, { getChallenge } from "../services/DataService";
import { AppData } from "../types";
import { timeAgo } from "../utils/time";

export default function StoryScreen() {
  const { author, circle } = useLocalSearchParams<{ author: string; circle: string }>();
  const [data, setData] = useState<AppData>();
  const insets = useSafeAreaInsets();

  // Load saved check-ins and circle posts
  useEffect(() => {
    DataService.getData().then(setData);
  }, []);

  if (!data) return null;

  // Find selected user's story and photo
  const mine = data.checkIns.find((c) => c.audience === circle);
  const theirs = data.posts.find((p) => p.circleId === circle && p.author === author);
  const story =
    author === "You"
      ? mine && { ...mine, photo: { uri: mine.photoUri } }
      : theirs && { ...theirs, photo: postImages[theirs.id] };
  if (!story) return null;

  const circleName = data.circles.find((c) => c.id === circle)?.name ?? "Circle";
  const challenge = getChallenge(story.challengeId);

  return (
    // Tap anywhere to close story
    <Pressable style={styles.screen} onPress={() => router.back()} accessible={false}>
      <StatusBar style="light" />
      <Image
        source={story.photo}
        style={styles.photo}
        accessibilityLabel={`${author}'s check-in photo${story.caption ? `: ${story.caption}` : ""}`}
      />
      <View style={[StyleSheet.absoluteFill, styles.overlay]} />

      <View style={[styles.top, { paddingTop: insets.top + space.sm }]}>
        <View style={styles.avatar}>
          <Text style={styles.initial}>{author[0]}</Text>
        </View>
        <View style={styles.topText} accessible>
          <Text style={styles.author}>{author}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="lock-closed" size={12} color={colours.onImageMuted} />
            {/* Show which circle can see story and when it was posted. */}
            <Text style={styles.meta}>
              {circleName} only · {timeAgo(story.createdAt)}
            </Text>
          </View>
        </View>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Close story"
          hitSlop={12}
        >
          <Ionicons name="close" size={28} color={colours.onPrimary} />
        </Pressable>
      </View>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + space.xl }]}>
        <Text style={styles.challenge}>
          {challenge.title} · ~{challenge.minutes} min
        </Text>
        {story.caption ? <Text style={styles.caption}>{story.caption}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: colours.primary,
  },
  photo: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    paddingHorizontal: sizes.screenPadding,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colours.success,
    backgroundColor: colours.placeholder,
    alignItems: "center",
    justifyContent: "center",
  },
  initial: {
    ...type.calloutStrong,
    color: colours.muted,
  },
  topText: {
    flex: 1,
  },
  author: {
    ...type.bodyStrong,
    color: colours.onPrimary,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.xs,
  },
  meta: {
    ...type.footnote,
    color: colours.onImageMuted,
  },
  bottom: {
    gap: space.xs,
    paddingHorizontal: sizes.screenPadding,
    paddingTop: space.lg,
    backgroundColor: colours.overlayStrong,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  challenge: {
    ...type.footnoteStrong,
    color: colours.onImageMuted,
  },
  caption: {
    ...type.headline,
    color: colours.onPrimary,
  },
});
