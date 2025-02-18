import { Stack } from "expo-router";
import "../global.css";
import { useFonts } from "expo-font";
import * as NavigationBar from "expo-navigation-bar";
import { useEffect } from "react";
import { StatusBar } from "react-native";
export default function RootLayout() {
  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("rgba(18, 112, 138, 0.45)");
  }, []);
  const [loaded] = useFonts({
    "SpaceMono-Regular": require("./../assets/fonts/SpaceMono-Regular.ttf"),
    "Jersey15-Regular": require("./../assets/fonts/Jersey15-Regular.ttf"),
    "ABeeZee-Regular": require("./../assets/fonts/ABeeZee-Regular.ttf"),
    "Inter-Variable": require("./../assets/fonts/Inter-VariableFont_opsz_wght.ttf"),
    "Inter-Italic": require("./../assets/fonts/Inter-Italic-VariableFont_opsz_wght.ttf"),
  });
  return (
    <>
      <StatusBar backgroundColor="#12568a" barStyle="light-content" />
      <Stack
        screenOptions={{ headerShown: false, animation: "slide_from_right" }}
      >
        <Stack.Screen name="index" />
      </Stack>
    </>
  );
}
