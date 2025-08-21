import { ThemedText } from "@/components/ThemedText";
import { useAuth } from "@/contexts/AuthProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";

// Datos de ejemplo para clientes con fiado
const sampleClients = [
  { id: "1", name: "Juan Pérez", debt: 1250.50, phone: "555-1234" },
  { id: "2", name: "María García", debt: 750.00, phone: "555-5678" },
  { id: "3", name: "Carlos López", debt: 2300.75, phone: "555-9012" },
  { id: "4", name: "Ana Martínez", debt: 500.00, phone: "555-3456" },
  { id: "5", name: "Pedro Rodríguez", debt: 1800.25, phone: "555-7890" },
];

export default function FiadoScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const renderClientItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.clientItem}
      onPress={() => router.push(`/fiado/cliente/${item.id}`)}
    >
      <View style={styles.clientInfo}>
        <ThemedText style={styles.clientName}>{item.name}</ThemedText>
        <ThemedText style={styles.clientPhone}>{item.phone}</ThemedText>
      </View>
      <View style={styles.debtInfo}>
        <ThemedText style={styles.debtAmount}>${item.debt.toFixed(2)}</ThemedText>
        <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      {/* Encabezado */}
      <LinearGradient
        colors={["#4a00e0", "#8e2de2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View>
          <ThemedText style={styles.headerTitle}>Fiado</ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Bienvenido, {user?.name}
          </ThemedText>
        </View>
      </LinearGradient>

      <View style={styles.container}>
        {/* Tarjeta de título */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="account-cash" size={24} color="#333" />
            <ThemedText style={styles.cardTitle}>Cuentas de Fiado</ThemedText>
          </View>
          <ThemedText style={styles.cardSubtitle}>
            Clientes con deuda pendiente
          </ThemedText>
        </View>

        {/* Lista de clientes */}
        <FlatList
          data={sampleClients}
          renderItem={renderClientItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        {/* Botón para agregar cliente */}
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push("/fiado/agregar")}
        >
          <MaterialCommunityIcons name="plus" size={24} color="white" />
          <ThemedText style={styles.addButtonText}>Agregar Cliente Fiado</ThemedText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f4f5f7",
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "white",
    opacity: 0.9,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
    color: "#333",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
    marginLeft: 34, // Para alinear con el título
  },
  listContent: {
    paddingBottom: 80, // Espacio para el botón flotante
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
  debtInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  debtAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e74c3c",
    marginRight: 8,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    left: 20,
    backgroundColor: "#28a745",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});