import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function FiadosEmptyState() {
  return (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons name="account-off" size={48} color="#ccc" />
      <Text style={styles.emptyStateText}>No hay clientes fiados registrados aún.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
});
