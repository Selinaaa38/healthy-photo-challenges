import { Ionicons } from "@react-native-vector-icons/ionicons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Button } from "../../../components/Button";
import { colours, radius, sizes, space, type } from "../../../constants/theme";
import { contacts } from "../../../data/seed";
import DataService, { circleNameError } from "../../../services/DataService";
import { Circle } from "../../../types";

// New circle (US12). B1: the name is checked (not blank, 30
// characters or fewer, not already used) and creating is confirmed.
export default function CreateCircleScreen() {
  const [circles, setCircles] = useState<Circle[]>([]);
  const [name, setName] = useState("");
  const [invited, setInvited] = useState<string[]>([]);
  const [showError, setShowError] = useState(false); // after the first try

  useEffect(() => {
    DataService.getData().then((data) => setCircles(data.circles));
  }, []);

  const error = circleNameError(name, circles);

  const toggle = (person: string) =>
    setInvited(invited.includes(person) ? invited.filter((p) => p !== person) : [...invited, person]);

  const create = async () => {
    if (error) {
      setShowError(true);
      return;
    }
    await DataService.createCircle(name, invited);
    Alert.alert(
      "Circle created",
      invited.length
        ? `${name.trim()} is ready. ${invited.join(" and ")} can see posts once they accept.`
        : `${name.trim()} is ready. You can invite people later.`,
      [{ text: "OK", onPress: () => router.back() }],
    );
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      automaticallyAdjustKeyboardInsets
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.label}>Circle name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        onBlur={() => name !== "" && setShowError(true)}
        placeholder="e.g. Gym buddies"
        placeholderTextColor={colours.muted}
        accessibilityLabel="Circle name"
        style={[styles.input, showError && error && styles.inputError]}
      />
      {showError && error && (
        <View style={styles.error} accessibilityRole="alert">
          <Ionicons name="alert-circle" size={16} color={colours.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <Text style={styles.label}>Invite people</Text>
      <View style={styles.people}>
        {contacts.map((person) => {
          const isInvited = invited.includes(person);
          return (
            <Pressable
              key={person}
              onPress={() => toggle(person)}
              accessibilityRole="checkbox"
              accessibilityLabel={person}
              accessibilityState={{ checked: isInvited }}
              style={styles.person}
            >
              <View style={styles.avatar}>
                <Text style={styles.initial}>{person[0]}</Text>
              </View>
              <Text style={styles.personName}>{person}</Text>
              <Ionicons
                name={isInvited ? "checkbox" : "square-outline"}
                size={26}
                color={isInvited ? colours.text : colours.muted}
              />
            </Pressable>
          );
        })}
      </View>

      <View style={styles.note}>
        <Ionicons name="lock-closed-outline" size={14} color={colours.muted} />
        <Text style={styles.noteText}>Invited people can't see any posts until they accept.</Text>
      </View>

      <Button
        label={invited.length ? `Create circle and invite ${invited.length}` : "Create circle"}
        onPress={create}
      />
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
  label: {
    ...type.bodyStrong,
    color: colours.text,
  },
  input: {
    ...type.body,
    minHeight: sizes.button,
    paddingHorizontal: space.lg,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colours.line,
    backgroundColor: colours.surface,
    color: colours.text,
  },
  inputError: {
    borderColor: colours.error,
    backgroundColor: colours.errorTint,
  },
  error: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.xs,
    marginTop: -space.xs,
  },
  errorText: {
    ...type.footnote,
    color: colours.error,
  },
  people: {
    padding: space.sm,
    borderRadius: radius.lg,
    backgroundColor: colours.surface,
  },
  person: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    minHeight: 52,
    paddingHorizontal: space.sm,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colours.elevated,
    alignItems: "center",
    justifyContent: "center",
  },
  initial: {
    ...type.calloutStrong,
    color: colours.muted,
  },
  personName: {
    ...type.body,
    color: colours.text,
    flex: 1,
  },
  note: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
  },
  noteText: {
    ...type.footnote,
    color: colours.muted,
    flex: 1,
  },
});
