import { Ionicons } from "@react-native-vector-icons/ionicons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/Button";
import { colours, space, type } from "../../constants/theme";
import DataService from "../../services/DataService";

// Figma 01 Welcome: full-screen photo with the two ways to start (US01, US02).
export default function WelcomeScreen() {
  const exploreFirst = async () => {
    await DataService.start();
    router.replace("/today");
  };

  return (
    <ImageBackground
      source={require("../../assets/images/welcome.jpg")}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar style="light" />
      <View style={[StyleSheet.absoluteFill, styles.overlay]} />

      <SafeAreaView style={styles.content}>
        <Text style={styles.title} accessibilityRole="header">
          Healthy Photo Challenges
        </Text>
        <Text style={styles.subtitle}>
          Small healthy moments. One photo. Shared only with people you trust.
        </Text>
        <View style={styles.privacy}>
          <Ionicons name="lock-closed-outline" size={16} color={colours.onImageMuted} />
          <Text style={styles.note}>
            Your check-ins stay private unless you choose to share
          </Text>
        </View>

        <Button
          label="Set my preferences"
          variant="light"
          accessibilityHint="About 30 seconds. Choose goals, activities and time."
          onPress={() => router.navigate("/onboarding/preferences")}
        />
        <Text style={styles.caption}>About 30 seconds · choose goals, activities and time</Text>

        <Button
          label="Explore first"
          variant="outlineLight"
          accessibilityHint="Try 3 general challenges now and set preferences later."
          onPress={exploreFirst}
        />
        <Text style={styles.caption}>Try 3 general challenges now · set preferences later</Text>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.primary,
  },
  overlay: {
    backgroundColor: colours.overlay,
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: space.xxl,
    paddingBottom: space.lg,
  },
  title: {
    ...type.display,
    color: colours.onPrimary,
  },
  subtitle: {
    ...type.body,
    color: colours.onPrimary,
    marginTop: space.md,
  },
  privacy: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    marginTop: space.lg,
    marginBottom: space.lg,
  },
  note: {
    ...type.footnote,
    color: colours.onImageMuted,
    flex: 1,
  },
  caption: {
    ...type.footnote,
    color: colours.onImageMuted,
    textAlign: "center",
    marginTop: space.sm,
    marginBottom: space.lg,
  },
});
