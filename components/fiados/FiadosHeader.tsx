import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '../ThemedText';

interface FiadosHeaderProps {
  userName: string;
}

export default function FiadosHeader({ userName }: FiadosHeaderProps) {
  return (
    <LinearGradient
      colors={["#4a00e0", "#8e2de2"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
      }}
    >
      <View>
        <ThemedText style={{ fontSize: 28, fontWeight: "bold", color: "white" }}>Fiado</ThemedText>
        <ThemedText style={{ fontSize: 16, color: "white", opacity: 0.9 }}>
          Bienvenido, {userName}
        </ThemedText>
      </View>
    </LinearGradient>
  );
}
