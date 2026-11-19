import { Ionicons } from "@react-native-vector-icons/ionicons";
import { router, Stack, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { PostCard, Reaction } from "../../../components/PostCard";
import { colours, radius, sizes, space, type } from "../../../constants/theme";
import { postImages } from "../../../data/seed";
import DataService, { describeMembers, getChallenge } from "../../../services/DataService";
import { AppData, Post } from "../../../types";
import { timeAgo } from "../../../utils/time";

const reactionTypes = [
  { id: "cheer", label: "Cheer", icon: "sparkles" },
  { id: "love", label: "Love", icon: "heart-outline" },
  { id: "metoo", label: "Me too", icon: "thumbs-up-outline" },
] as const;

// Circle feed: posts only this circle can see, with reactions and
// comments (US06). 
// F8: each post says who can see it ("Family only").
// B5: reaction marked and can be tapped again to undo.
// Leave this circle, after a confirmation (US13)
export default function CircleFeedScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [data, setData] = useState<AppData>();
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  useFocusEffect(
    useCallback(() => {
      DataService.getData().then(setData);
    }, []),
  );

  const circle = data?.circles.find((c) => c.id === id);
  if (!data || !circle) return null;

  const react = async (postId: string, reactionId: string) => {
    setData(await DataService.toggleReaction(postId, reactionId as "cheer" | "love" | "metoo"));
  };

  const sendComment = async (postId: string) => {
    setData(await DataService.addComment(postId, drafts[postId].trim()));
    setDrafts({ ...drafts, [postId]: "" });
  };

  // Confirm before deleting comment / leaving circle
  const deleteComment = (postId: string, commentId: string) => {
    Alert.alert("Delete your comment?", undefined, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => setData(await DataService.deleteComment(postId, commentId)),
      },
    ]);
  };

  const confirmLeave = () => {
    Alert.alert(
      `Leave ${circle.name}?`,
      "You'll stop seeing its posts. Your private check-ins aren't affected.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Leave",
          style: "destructive",
          onPress: async () => {
            await DataService.leaveCircle(circle.id);
            router.back();
          },
        },
      ],
    );
  };

  const reactionsFor = (post: Post): Reaction[] =>
    reactionTypes.map((r) => ({
      ...r,
      count: post.reactions[r.id].length,
      reactedByMe: post.reactions[r.id].includes("You"),
    }));

  // Combine circle post and shared check-ins
  // Sort by newest
  const items = [
    ...data.posts.filter((p) => p.circleId === circle.id).map((post) => ({ post, createdAt: post.createdAt })),
    ...data.checkIns.filter((c) => c.audience === circle.id).map((checkIn) => ({ checkIn, createdAt: checkIn.createdAt })),
  ].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const audience = `${circle.name} only`;

  return (
    <>
      <Stack.Screen
        options={{
          title: circle.name,
          headerRight: () => (
            <Pressable
              onPress={confirmLeave}
              accessibilityRole="button"
              accessibilityLabel={`Leave ${circle.name}`}
              hitSlop={12}
            >
              <Ionicons name="exit-outline" size={24} color={colours.error} />
            </Pressable>
          ),
        }}
      />
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
        automaticallyAdjustKeyboardInsets
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.banner}>
          <Ionicons name="lock-closed-outline" size={14} color={colours.muted} />
          <Text style={styles.bannerText}>
            {circle.members.length === 1
              ? "Only you can see posts until people accept"
              : `Only ${describeMembers(circle)} can see posts`}
          </Text>
        </View>

        {items.length === 0 && (
          <Text style={styles.empty}>
            No posts yet. Share a check-in with {circle.name} to start.
          </Text>
        )}

        {items.map((item) => {
          if ("checkIn" in item) {
            const checkIn = item.checkIn;
            return (
              <PostCard
                key={checkIn.id}
                author="You"
                audience={audience}
                timeAgo={timeAgo(checkIn.createdAt)}
                goal={getChallenge(checkIn.challengeId).goal}
                photo={{ uri: checkIn.photoUri }}
                selfie={checkIn.selfieUri ? { uri: checkIn.selfieUri } : undefined}
                caption={checkIn.caption || undefined}
                reactions={[]}
                onReact={() => {}}
              />
            );
          }
          const post = item.post;
          const draft = drafts[post.id] ?? "";
          return (
            <View key={post.id} style={styles.post}>
              <PostCard
                author={post.author}
                audience={audience}
                timeAgo={timeAgo(post.createdAt)}
                goal={getChallenge(post.challengeId).goal}
                photo={postImages[post.id]}
                caption={post.caption}
                reactions={reactionsFor(post)}
                onReact={(reactionId) => react(post.id, reactionId)}
              />
              <View style={styles.comments}>
                {post.comments.map((comment) => (
                  <View key={comment.id} style={styles.commentLine}>
                    <Text style={styles.comment}>
                      <Text style={styles.commentAuthor}>{comment.author} </Text>
                      {comment.text}
                      <Text style={styles.commentTime}> {timeAgo(comment.createdAt)}</Text>
                    </Text>
                    {/* You can delete your own comments */}
                    {comment.author === "You" && (
                      <Pressable
                        onPress={() => deleteComment(post.id, comment.id)}
                        accessibilityRole="button"
                        accessibilityLabel="Delete your comment"
                        hitSlop={12}
                      >
                        <Ionicons name="trash-outline" size={16} color={colours.muted} />
                      </Pressable>
                    )}
                  </View>
                ))}
                <View style={styles.commentRow}>
                  <TextInput
                    value={draft}
                    onChangeText={(text) => setDrafts({ ...drafts, [post.id]: text })}
                    placeholder="Say something kind..."
                    maxLength={300}
                    placeholderTextColor={colours.muted}
                    accessibilityLabel={`Comment on ${post.author}'s post`}
                    style={styles.input}
                  />
                  <Pressable
                    onPress={() => sendComment(post.id)}
                    disabled={draft.trim() === ""}
                    accessibilityRole="button"
                    accessibilityLabel="Send comment"
                    accessibilityState={{ disabled: draft.trim() === "" }}
                    style={[styles.send, draft.trim() === "" && styles.sendDisabled]}
                  >
                    <Ionicons name="send" size={18} color={colours.onPrimary} />
                  </Pressable>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colours.bg,
  },
  content: {
    paddingBottom: space.xxxl,
    gap: space.xxl,
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.xs,
    paddingHorizontal: sizes.screenPadding,
  },
  bannerText: {
    ...type.footnote,
    color: colours.muted,
    flex: 1,
  },
  empty: {
    ...type.body,
    color: colours.muted,
    textAlign: "center",
    padding: sizes.screenPadding,
  },
  post: {
    gap: space.md,
  },
  comments: {
    gap: space.sm,
    paddingHorizontal: space.lg,
  },
  comment: {
    ...type.callout,
    color: colours.text,
    flex: 1,
  },
  commentLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
  },
  commentAuthor: {
    ...type.calloutStrong,
  },
  commentTime: {
    ...type.footnote,
    color: colours.muted,
  },
  commentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
  },
  input: {
    ...type.body,
    flex: 1,
    minHeight: sizes.minTouch,
    paddingHorizontal: space.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colours.line,
    backgroundColor: colours.surface,
    color: colours.text,
  },
  send: {
    width: sizes.minTouch,
    height: sizes.minTouch,
    borderRadius: sizes.minTouch / 2,
    backgroundColor: colours.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendDisabled: {
    opacity: 0.35,
  },
});
