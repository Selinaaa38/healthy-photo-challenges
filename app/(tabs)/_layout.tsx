import { Ionicons } from "@react-native-vector-icons/ionicons";
import { router, Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";
import { colours } from "../../constants/theme";

// The five Expo Router tabs: Today, Circles, Check in, Rewards, Profile.
// The centre "Check in" tab is a black camera button which opens the check-in 
// flow over the tabs.
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colours.text,
        tabBarInactiveTintColor: colours.muted,
      }}
    >
      <Tabs.Screen
        name="today"
        options={{
          tabBarLabel: "Today",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="circles"
        options={{
          tabBarLabel: "Circles",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "people" : "people-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          tabBarLabel: () => null,
          tabBarAccessibilityLabel: "Check in with a photo",
          tabBarIcon: () => (
            <View style={styles.cameraButton}>
              <Ionicons name="camera" size={22} color={colours.onPrimary} />
            </View>
          ),
        }}
        listeners={{
          tabPress: (event) => {
            event.preventDefault();
            router.push("/checkin");
          },
        }}
      />
      <Tabs.Screen
        name="rewards"
        options={{
          tabBarLabel: "Rewards",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "leaf" : "leaf-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  cameraButton: {
    width: 54,
    height: 38,
    borderRadius: 999,
    backgroundColor: colours.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});
