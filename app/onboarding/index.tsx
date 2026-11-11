import { router } from "expo-router";
import { Button } from "../../components/Button";
import { PlaceholderScreen } from "../../components/PlaceholderScreen";
import DataService from "../../services/DataService";

export default function WelcomeScreen() {
  return (
    <PlaceholderScreen title="Welcome" figma="Figma 01 Welcome">
      <Button
        label="Set my preferences"
        onPress={() => router.navigate("/onboarding/preferences")}
      />
      <Button
        label="Explore first"
        variant="secondary"
        onPress={async () => {
          await DataService.start();
          router.replace("/today");
        }}
      />
    </PlaceholderScreen>
  );
}
