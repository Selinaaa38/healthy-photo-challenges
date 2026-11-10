import { Ionicons } from "@react-native-vector-icons/ionicons";
import { ComponentProps } from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colours, radius, space, type } from "../constants/theme";

// A check-in post in a circle feed
// - Reactions the user has made are filled black with a tick, and a line
//   under them says "You and 2 others". (beta change 5)

type IconName = ComponentProps<typeof Ionicons>["name"];

export type Reaction = {
  id: string;
  label: string; // "Cheer"
  icon: IconName; // "sparkles"
  count: number; // total, including the user
  reactedByMe: boolean;
};

type PostCardProps = {
  author: string;
  audience: string; // "Family only"
  timeAgo: string; // "2h ago"
  goal: string; // "Nourish"
  photo?: ImageSourcePropType;
  selfie?: ImageSourcePropType;
  caption?: string;
  reactions: Reaction[];
  onReact: (reactionId: string) => void;
  onMore?: () => void;
};

export function PostCard({
  author,
  audience,
  timeAgo,
  goal,
  photo,
  selfie,
  caption,
  reactions,
  onReact,
  onMore,
}: PostCardProps) {
  const myReaction = reactions.find((reaction) => reaction.reactedByMe);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar} />
        <View style={styles.headerText}>
          <Text style={styles.author}>{author}</Text>
          <View
            style={styles.audienceRow}
            accessible={true}
            accessibilityLabel={`Visible to ${audience}, posted ${timeAgo}, ${goal}`}
          >
            <Ionicons name="lock-closed" size={12} color={colours.muted} />
            <Text style={styles.meta}>
              {audience} · {timeAgo} · {goal}
            </Text>
          </View>
        </View>
        {onMore && (
          <Pressable
            onPress={onMore}
            accessibilityRole="button"
            accessibilityLabel="Post options"
            style={styles.moreButton}
          >
            <Ionicons
              name="ellipsis-horizontal"
              size={20}
              color={colours.text}
            />
          </Pressable>
        )}
      </View>

      <View style={styles.photo}>
        {photo && (
          <Image
            source={photo}
            style={StyleSheet.absoluteFill}
            accessible={true}
            accessibilityLabel={`${author}'s check-in photo${caption ? `: ${caption}` : ""}`}
          />
        )}
        {selfie && (
          <Image
            source={selfie}
            style={styles.selfie}
            accessible={true}
            accessibilityLabel={`${author}'s selfie`}
          />
        )}
      </View>

      <View style={styles.body}>
        {caption && <Text style={styles.caption}>{caption}</Text>}

        <View style={styles.reactions}>
          {reactions.map((reaction) => (
            <Pressable
              key={reaction.id}
              onPress={() => onReact(reaction.id)}
              accessibilityRole="button"
              accessibilityLabel={`${reaction.label}, ${reaction.count}`}
              accessibilityState={{ selected: reaction.reactedByMe }}
              accessibilityHint={
                reaction.reactedByMe
                  ? "Tap to remove your reaction"
                  : "Tap to react"
              }
              hitSlop={{ top: 5, bottom: 5 }}
              style={({ pressed }) => [
                styles.reaction,
                reaction.reactedByMe && styles.reacted,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons
                name={reaction.reactedByMe ? "checkmark" : reaction.icon}
                size={15}
                color={reaction.reactedByMe ? colours.onPrimary : colours.text}
              />
              <Text
                style={[
                  styles.reactionLabel,
                  reaction.reactedByMe && styles.reactedLabel,
                ]}
              >
                {reaction.label} {reaction.count}
              </Text>
            </Pressable>
          ))}
        </View>

        {myReaction && (
          <Text style={styles.reactedNote}>
            {myReaction.count > 1
              ? `You and ${myReaction.count - 1} ${myReaction.count - 1 === 1 ? "other" : "others"}`
              : "You"}{" "}
            reacted with {myReaction.label}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: space.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: space.lg,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colours.placeholder,
  },
  headerText: {
    flex: 1,
  },
  author: {
    ...type.bodyStrong,
    color: colours.text,
  },
  audienceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.xs,
  },
  meta: {
    ...type.caption,
    color: colours.muted,
  },
  moreButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  photo: {
    height: 360,
    backgroundColor: colours.placeholder,
    overflow: "hidden",
  },
  selfie: {
    position: "absolute",
    top: space.md,
    left: space.md,
    width: 95,
    height: 143,
    borderRadius: radius.xl,
    borderWidth: 3,
    borderColor: colours.bg,
  },
  body: {
    gap: 10,
    paddingHorizontal: space.lg,
  },
  caption: {
    ...type.body,
    color: colours.text,
  },
  reactions: {
    flexDirection: "row",
    gap: space.sm,
  },
  reaction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minHeight: 34,
    paddingHorizontal: 13,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colours.line,
    backgroundColor: colours.surface,
  },
  reacted: {
    backgroundColor: colours.primary,
    borderColor: colours.primary,
  },
  pressed: {
    opacity: 0.6,
  },
  reactionLabel: {
    ...type.footnoteStrong,
    color: colours.text,
  },
  reactedLabel: {
    color: colours.onPrimary,
  },
  reactedNote: {
    ...type.footnote,
    color: colours.muted,
  },
});
