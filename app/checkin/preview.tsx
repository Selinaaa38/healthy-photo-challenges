import { Ionicons } from "@react-native-vector-icons/ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Button } from "../../components/Button";
import { colours, radius, sizes, space, type } from "../../constants/theme";

// Preview: check the photo, add an optional caption (US04).
// B6: "Delete photo
export default function PreviewScreen() {
  const { id, photo, selfie } = useLocalSearchParams<{ id: string; photo: string; selfie?: string }>();
  const [caption, setCaption] = useState("");

  const confirmDelete = () => {
    Alert.alert("Delete this photo?", "You'll go back to the camera to take a new one.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete photo", style: "destructive", onPress: () => router.back() },
    ]);
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      // Scrolls the caption field above the keyboard while typing
      automaticallyAdjustKeyboardInsets
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.step}>Step 1 of 2 · Check your photo</Text>

      <View>
        <Image source={{ uri: photo }} style={styles.photo} accessibilityLabel="Your check-in photo" />
        {selfie && (
          <Image source={{ uri: selfie }} style={styles.selfie} accessibilityLabel="Your selfie" />
        )}
      </View>

      <View style={styles.actions}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          style={({ pressed }) => [styles.action, pressed && styles.pressed]}
        >
          <Ionicons name="camera-reverse-outline" size={18} color={colours.text} />
          <Text style={styles.actionText}>Replace photo</Text>
        </Pressable>
        <Pressable
          onPress={confirmDelete}
          accessibilityRole="button"
          style={({ pressed }) => [styles.action, pressed && styles.pressed]}
        >
          <Ionicons name="trash-outline" size={18} color={colours.error} />
          <Text style={[styles.actionText, styles.deleteText]}>Delete photo</Text>
        </Pressable>
      </View>

      <Text style={styles.label}>Caption (optional)</Text>
      <TextInput
        value={caption}
        onChangeText={setCaption}
        placeholder="e.g. Found a new shortcut past the library"
        placeholderTextColor={colours.muted}
        maxLength={150}
        accessibilityLabel="Caption, optional"
        style={styles.input}
      />

      <Button
        label="Next: choose who can see it"
        onPress={() =>
          router.navigate({
            pathname: "/checkin/audience",
            params: { id, photo, selfie, caption: caption.trim() },
          })
        }
      />
      <Button label="Cancel check-in" variant="text" onPress={() => router.dismissTo("/today")} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colours.bg,
  },
  content: {
    padding: sizes.screenPadding,
    gap: space.md,
  },
  step: {
    ...type.overline,
    color: colours.muted,
  },
  photo: {
    width: "100%",
    height: 360,
    borderRadius: radius.lg,
    backgroundColor: colours.placeholder,
  },
  selfie: {
    position: "absolute",
    top: space.md,
    left: space.md,
    width: 84,
    height: 110,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colours.onPrimary,
  },
  actions: {
    flexDirection: "row",
    gap: space.sm,
  },
  action: {
    flex: 1,
    flexDirection: "row",
    minHeight: sizes.minTouch,
    alignItems: "center",
    justifyContent: "center",
    gap: space.xs,
    borderRadius: radius.md,
    backgroundColor: colours.surface,
  },
  actionText: {
    ...type.calloutStrong,
    color: colours.text,
  },
  deleteText: {
    color: colours.error,
  },
  pressed: {
    opacity: 0.6,
  },
  label: {
    ...type.bodyStrong,
    color: colours.text,
  },
  input: {
    ...type.body,
    minHeight: sizes.minTouch,
    paddingHorizontal: space.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colours.line,
    color: colours.text,
  },
});
