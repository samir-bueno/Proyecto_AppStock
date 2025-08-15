import { Tabs } from "expo-router";
import React from "react";

import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ headerShown: false }} />
      <Tabs.Screen name="explore" options={{ headerShown: false }} />
      <Tabs.Screen name="(Auth)/login" options={{ headerShown: false }} />
      <Tabs.Screen name="(Auth)/signin" options={{ headerShown: false }} />
    </Tabs>
  );
}