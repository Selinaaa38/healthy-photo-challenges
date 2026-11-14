import { Ionicons } from "@react-native-vector-icons/ionicons";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/Button";
import { colours, radius, sizes, space, type } from "../../constants/theme";
import { dailySpecial } from "../../data/seed";
import DataService, { getChallenge } from "../../services/DataService";

// Camera (US04). Opened from a challenge, or from the camera tab,
// which picks the first challenge still to do.
// B3: the selfie is labelled and can be turned off. With it on, the camera
// flips to the front for a second photo after the main one.
export default function CameraScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const [id, setId] = useState(params.id);
  const [permission, requestPermission] = useCameraPermissions();
  const camera = useRef<CameraView>(null);
  const [facing, setFacing] = useState<"back" | "front">("back");
  const [selfieOn, setSelfieOn] = useState(true);
  const [photo, setPhoto] = useState<string>(); // set once the main photo is taken

  useEffect(() => {
    if (!params.id) {
      DataService.getData().then((data) => {
        const next = data.tasks.find((t) => t.status === "active");
        setId(next?.challengeId ?? dailySpecial.challengeId);
      });
    }
  }, [params.id]);

  if (!id || !permission) return null;
  const challenge = getChallenge(id);

  const goToPreview = (photoUri: string, selfieUri?: string) => {
    router.navigate({
      pathname: "/checkin/preview",
      params: { id, photo: photoUri, selfie: selfieUri },
    });
    // Ready for a retake if they come back
    setPhoto(undefined);
    setFacing("back");
  };

  const takePicture = async () => {
    const picture = await camera.current?.takePictureAsync({ quality: 0.7 });
    if (!picture) return;
    if (photo) {
      goToPreview(photo, picture.uri);
    } else if (selfieOn) {
      setPhoto(picture.uri);
      setFacing("front");
    } else {
      goToPreview(picture.uri);
    }
  };

  // Gallery upload as an alternative
  const pickFromGallery = async () => {
    const permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissions.granted) {
      Alert.alert("No access to photos", "Allow photo access in Settings to choose a photo.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"] });
    if (!result.canceled) goToPreview(result.assets[0].uri);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />
      <View style={styles.top}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Close camera"
          hitSlop={12}
        >
          <Ionicons name="close" size={26} color={colours.onPrimary} />
        </Pressable>
        <View style={styles.topText}>
          <Text style={styles.topTitle} numberOfLines={1}>
            {challenge.title}
          </Text>
          <Text style={styles.topMeta}>
            ~{challenge.minutes} min · {challenge.goal}
          </Text>
        </View>
        <View style={styles.topSpacer} />
      </View>

      {permission.granted ? (
        <View style={styles.cameraArea}>
          <CameraView ref={camera} style={StyleSheet.absoluteFill} facing={facing} />

          {!photo && (
            <Pressable
              onPress={() => setSelfieOn(!selfieOn)}
              accessibilityRole="switch"
              accessibilityLabel="Selfie"
              accessibilityState={{ checked: selfieOn }}
              accessibilityHint="Adds a selfie after your main photo"
              style={[styles.selfie, selfieOn && styles.selfieOn]}
            >
              <Ionicons
                name={selfieOn ? "person-circle-outline" : "close-circle-outline"}
                size={28}
                color={colours.onPrimary}
              />
              <Text style={styles.selfieText}>{selfieOn ? "Selfie on" : "Selfie off"}</Text>
            </Pressable>
          )}

          <View style={styles.privacy}>
            <Ionicons name="lock-closed" size={14} color={colours.onPrimary} />
            <Text style={styles.privacyText}>
              {photo ? "Now take your selfie" : "Nothing is shared until you choose who sees it"}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.permission}>
          <Text style={styles.permissionText}>
            Allow camera access to take your check-in photo, or choose one from your gallery.
          </Text>
          <Button label="Allow camera" variant="light" onPress={requestPermission} />
        </View>
      )}

      <View style={styles.controls}>
        <Pressable
          onPress={pickFromGallery}
          accessibilityRole="button"
          accessibilityLabel="Choose from gallery"
          style={styles.sideButton}
        >
          <Ionicons name="image-outline" size={24} color={colours.onPrimary} />
        </Pressable>
        <Pressable
          onPress={takePicture}
          disabled={!permission.granted}
          accessibilityRole="button"
          accessibilityLabel={photo ? "Take selfie" : "Take photo"}
          style={({ pressed }) => [styles.shutter, pressed && styles.pressed]}
        >
          <View style={styles.shutterInner} />
        </Pressable>
        <Pressable
          onPress={() => setFacing(facing === "back" ? "front" : "back")}
          accessibilityRole="button"
          accessibilityLabel="Flip camera"
          style={styles.sideButton}
        >
          <Ionicons name="camera-reverse-outline" size={24} color={colours.onPrimary} />
        </Pressable>
      </View>
      {photo ? (
        <Button label="Skip selfie" variant="outlineLight" onPress={() => goToPreview(photo)} style={styles.skip} />
      ) : (
        <Text style={styles.hint}>
          Selfie is optional · tap it to turn {selfieOn ? "off" : "on"}
        </Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colours.primary,
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: sizes.screenPadding,
    paddingVertical: space.sm,
  },
  topText: {
    flex: 1,
    alignItems: "center",
  },
  topTitle: {
    ...type.bodyStrong,
    color: colours.onPrimary,
  },
  topMeta: {
    ...type.caption,
    color: colours.onImageMuted,
  },
  topSpacer: {
    width: 26,
  },
  cameraArea: {
    flex: 1,
    overflow: "hidden",
  },
  selfie: {
    position: "absolute",
    top: space.lg,
    left: space.lg,
    width: 84,
    height: 110,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colours.onImageMuted,
    backgroundColor: colours.overlayStrong,
    alignItems: "center",
    justifyContent: "center",
    gap: space.xs,
  },
  selfieOn: {
    borderColor: colours.onPrimary,
  },
  selfieText: {
    ...type.captionStrong,
    color: colours.onPrimary,
  },
  privacy: {
    position: "absolute",
    bottom: space.lg,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: space.xs,
    paddingHorizontal: space.md,
    paddingVertical: space.xs,
    borderRadius: radius.pill,
    backgroundColor: colours.overlayStrong,
  },
  privacyText: {
    ...type.footnoteStrong,
    color: colours.onPrimary,
  },
  permission: {
    flex: 1,
    justifyContent: "center",
    padding: sizes.screenPadding,
    gap: space.lg,
  },
  permissionText: {
    ...type.body,
    color: colours.onPrimary,
    textAlign: "center",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: space.xxxl,
    paddingTop: space.xl,
  },
  sideButton: {
    width: sizes.button,
    height: sizes.button,
    borderRadius: radius.md,
    backgroundColor: colours.darkSurface,
    alignItems: "center",
    justifyContent: "center",
  },
  shutter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: colours.onPrimary,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: colours.onPrimary,
  },
  pressed: {
    opacity: 0.6,
  },
  hint: {
    ...type.caption,
    color: colours.onImageMuted,
    textAlign: "center",
    paddingVertical: space.md,
  },
  skip: {
    marginHorizontal: space.xxxl,
    marginVertical: space.sm,
  },
});
