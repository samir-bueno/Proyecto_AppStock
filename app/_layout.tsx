import { AuthProvider, useAuth } from "@/contexts/AuthProvider";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Usar conditional rendering con Screen components */}
      {isAuthenticated ? (
        // Usuario autenticado
        <>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(resumen)" options={{ headerShown: false }} />
          {/* Redirigir a tabs por defecto */}
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </>
      ) : (
        // Usuario no autenticado
        <>
          <Stack.Screen name="(Auth)" options={{ headerShown: false }} />
          {/* Redirigir a auth por defecto */}
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </>
      )}
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <AppContent />
        </ThemeProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
