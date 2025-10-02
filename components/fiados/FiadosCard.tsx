import React from 'react';
import { View } from 'react-native';
import { ThemedText } from '../ThemedText';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function FiadosCard() {
  return (
    <View style={{
      backgroundColor: "white",
      borderRadius: 12,
      padding: 20,
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    }}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
        <MaterialCommunityIcons name="account-group" size={28} color="#4a00e0" />
        <ThemedText style={{ fontSize: 18, fontWeight: "600", marginLeft: 10, color: "#333" }}>
          Clientes Fiados
        </ThemedText>
      </View>
      <ThemedText style={{ fontSize: 14, color: "#666", marginLeft: 34 }}>
        Administra tus clientes que tienen fiado
      </ThemedText>
    </View>
  );
}
