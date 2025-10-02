import React from 'react';
import { FlatList, TouchableOpacity, View, StyleSheet } from 'react-native';
import { ThemedText } from '../ThemedText';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface Client {
  id: string;
  name: string;
  phone?: string;
  owner_id: string;
  created?: string;
  updated?: string;
}

interface FiadosListProps {
  clients: Client[];
  onClientPress: (client: Client) => void;
}

export default function FiadosList({ clients, onClientPress }: FiadosListProps) {
  const renderClientItem = ({ item }: { item: Client }) => (
    <TouchableOpacity 
      style={styles.clientItem}
      onPress={() => onClientPress(item)}
    >
      <View style={styles.clientInfo}>
        <ThemedText style={styles.clientName}>{item.name}</ThemedText>
        <ThemedText style={styles.clientPhone}>
          {item.phone || "Sin teléfono"}
        </ThemedText>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={clients}
      renderItem={renderClientItem}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 80,
  },
  clientItem: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  clientPhone: {
    fontSize: 14,
    color: "#666",
  },
});
