import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect } from "react";
import "../global.css";

import AuthProvider from "@/providers/AuthProvider";
import CartProvider from "@/providers/CartProvider";
import NotificationProvider from "@/providers/NotificationProvider";
import QueryProvider from "@/providers/QueryProvider";

import { LocationProvider } from "@/providers/LocationProvider";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useColorScheme } from "react-native";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(user)",
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded) return null;

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "light" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <QueryProvider>
          <NotificationProvider>
            <LocationProvider>
              <CartProvider>
                  <Stack>
                    <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                    <Stack.Screen name="(admin)" options={{ headerShown: false }} />
                    <Stack.Screen name="(user)" options={{ headerShown: false }} />
                  </Stack>
              </CartProvider>
            </LocationProvider>
          </NotificationProvider>
        </QueryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
