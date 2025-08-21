import { useAuth } from "@/contexts/AuthProvider";
import { Redirect, Tabs } from "expo-router";
import { ActivityIndicator, View } from "react-native";
export default function TabLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (!isAuthenticated) {
    return <Redirect href="/(Auth)/login" />;
  }
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="ventas" />
      <Tabs.Screen name="inventario" />
      <Tabs.Screen name="fiados" />
      <Tabs.Screen name="resumen" />
    </Tabs>
  );
}
