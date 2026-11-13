import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Button } from "../../../components/Button";
import { Chip } from "../../../components/Chip";
import { Sheet } from "../../../components/Sheet";
import { colours, radius, sizes, space, type } from "../../../constants/theme";
import DataService from "../../../services/DataService";

const reasons = ["Too busy", "Not interested", "Too difficult", "Not possible here"];

// Skip with an optional reason and note. Plants and progress are
// kept (US10).
export default function SkipSheet() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");

  const skip = async () => {
    await DataService.skipChallenge(id, reason, note.trim());
    router.dismissTo("/today");
  };

  return (
    <Sheet
      title="Skip this challenge?"
      subtitle="It won't count as complete, and you keep all your plants and progress."
    >
      <Text style={styles.label}>Why? (optional, helps us suggest better)</Text>
      <View style={styles.chips}>
        {reasons.map((option) => (
          <Chip
            key={option}
            label={option}
            state={reason === option ? "selected" : "default"}
            // Tapping the chosen reason again clears it (the reason is optional)
            onPress={() => setReason(reason === option ? "" : option)}
          />
        ))}
      </View>

      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder="Add a note (optional)"
        placeholderTextColor={colours.muted}
        accessibilityLabel="Note, optional"
        style={styles.input}
      />

      <Button label="Skip challenge" onPress={skip} />
      <Button label="Keep it" variant="text" onPress={() => router.back()} />
    </Sheet>
  );
}

const styles = StyleSheet.create({
  label: {
    ...type.bodyStrong,
    color: colours.text,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space.sm,
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
