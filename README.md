# Healthy Photo Challenges (Beta)

COMP4511 T3 2026 beta application, built with React Native and Expo.

Healthy Photo Challenges suggests short, personalised wellbeing challenges. Users record each one with a photo, keep it private or share it with a trusted support circle, and grow a virtual world as they go.

## Requirements

- Git
- Node.js 20 or later
- npm
- The latest Expo Go app on an iPhone or Android phone (the project uses Expo SDK 58)

## Run the app

The app runs through an Expo tunnel, so it works on any network without the phone and computer needing to be on the same Wi-Fi.
Sign up for a free Expo account at https://expo.dev/signup.

```bash
git clone https://github.com/Selinaaa38/healthy-photo-challenges.git
cd healthy-photo-challenges
npm install
npx expo login
npm run tunnel
```

If Expo asks to install `@expo/ngrok`, press **Y**. When the QR code appears, scan it with your phone's camera (iPhone) or the Expo Go app (Android). Allow camera and photo access when asked, so you can take check-in photos.

To reset all data to the starting state of demo from the Welcome screen, open **Profile → Reset demo data**.

## Project structure

```
app/                 screens (Expo Router: each file is a route)
  _layout.tsx        root stack; check-in and stories open full screen
  index.tsx          sends you to Welcome or Today
  onboarding/        Welcome and preferences
  (tabs)/            Today, Circles, Check in (camera button), Rewards, Profile
  checkin/           camera, preview, audience, complete
  story.tsx          full-screen story from the Today row
components/          reusable UI (Button, Chip, ChallengeRow, PostCard, ...)
constants/theme.ts   colours, spacing, text styles and sizes
data/seed.ts         challenges and the demo data the app starts with
services/DataService.ts  loads and saves app data with AsyncStorage
types/index.ts       shared TypeScript types
utils/time.ts        date and time formatting
assets/images/       one photo per challenge, plus the Welcome and demo post photos
```

## Known limitations

- There is no server or account. Data is stored only on this phone, and other people's posts are simulated demo data.
- Inviting people to a circle uses a fixed list of contacts; searching by username is not built yet.
- Daily Special alerts can be switched on and off, but no real notifications are sent.
- The app is designed for iPhone in light mode.

## Built with

Expo SDK 58, React Native 0.88, React 19, TypeScript, Expo Router, expo-camera, expo-image-picker, AsyncStorage and @react-native-picker/picker.
