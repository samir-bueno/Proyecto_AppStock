import { useAuth } from "@/contexts/AuthProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function TabLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }
  if (!isAuthenticated) {
    return <Redirect href="/(Auth)/login" />;
  }
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="ventas"
        options={{
          title: "ventas",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cash-multiple" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen name="inventario" options={{
          title: "Inventario",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="package-variant-closed" size={22} color={color} />
          ),
        }}/>
      <Tabs.Screen name="fiados" options={{
          title: "Fiados",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account-cash" size={22} color={color} />
          ),
        }}/>
      <Tabs.Screen name="resumen" options={{
          title: "Resumen",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chart-bar" size={22} color={color} />
          ),
        }}/>
    </Tabs>
  );
}
