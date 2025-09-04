import { ThemedText } from "@/components/ThemedText";
import { useAuth } from "@/contexts/AuthProvider";
import { createCustomer, getCustomersByOwner } from "@/services/pocketBaseService";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

// Interfaces para TypeScript
interface Client {
  id: string;
  name: string;
  phone?: string;
  owner_id: string;
  created?: string;
  updated?: string;
}

export default function FiadoScreen() {
  const { user } = useAuth();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newClient, setNewClient] = useState({ name: "", phone: "" });
  const [addingClient, setAddingClient] = useState(false);

  // Función para cargar clientes desde PocketBase
  const loadClients = async () => {
    if (!user) return;
    setLoading(true);
    const result = await getCustomersByOwner(user.id);
    if (result.success) {
      setClients(result.data || []);
    } else {
      Alert.alert("Error", result.error);
    }
    setLoading(false);
  };

  // Cargar clientes al montar el componente
  useEffect(() => {
    loadClients();
  }, [user]);

  // Función para agregar nuevo cliente
  const addNewClient = async () => {
    if (!user) {
    Alert.alert("Error", "No hay usuario autenticado");
    return;
    }

    if (!newClient.name.trim()) {
      Alert.alert("Error", "El nombre es obligatorio");
      return;
    }

    setAddingClient(true);
    const result = await createCustomer({ ...newClient, owner_id: user.id });
    
    if (result.success) {
      Alert.alert("Éxito", "Cliente agregado correctamente");
      await loadClients(); // Recargamos la lista para ver el nuevo cliente
      setShowAddForm(false);
      setNewClient({ name: "", phone: "" });
    } else {
      Alert.alert("Error", result.error);
    }
    setAddingClient(false);
  };


  const renderClientItem = ({ item }: { item: Client }) => (
    <TouchableOpacity 
      style={styles.clientItem}
      onPress={() => {
        // Aquí puedes navegar a los detalles del cliente si lo necesitas
        Alert.alert(item.name, `Teléfono: ${item.phone || 'No proporcionado'}`);
      }}
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

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a00e0" />
          <ThemedText style={styles.loadingText}>Cargando clientes...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

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
            Clientes con crédito activo
          </ThemedText>
        </View>

        {/* Lista de clientes */}
        {clients.length > 0 ? (
          <FlatList
            data={clients}
            renderItem={renderClientItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="account-off" size={50} color="#ccc" />
            <ThemedText style={styles.emptyStateText}>
              No tienes clientes registrados
            </ThemedText>
          </View>
        )}

        {/* Botón para agregar cliente */}
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddForm(true)}
        >
          <MaterialCommunityIcons name="plus" size={24} color="white" />
          <ThemedText style={styles.addButtonText}>Agregar Cliente Fiado</ThemedText>
        </TouchableOpacity>

        {/* Modal para agregar nuevo cliente */}
        <Modal
          visible={showAddForm}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowAddForm(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ThemedText style={styles.modalTitle}>Agregar Nuevo Cliente</ThemedText>
              
              <TextInput
                style={styles.input}
                placeholder="Nombre del cliente *"
                value={newClient.name}
                onChangeText={(text) => setNewClient({...newClient, name: text})}
                placeholderTextColor="#999"
              />
              
              <TextInput
                style={styles.input}
                placeholder="Teléfono (opcional)"
                value={newClient.phone}
                onChangeText={(text) => setNewClient({...newClient, phone: text})}
                keyboardType="phone-pad"
                placeholderTextColor="#999"
              />
              
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowAddForm(false)}
                  disabled={addingClient}
                >
                  <ThemedText style={styles.cancelButtonText}>Cancelar</ThemedText>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={addNewClient}
                  disabled={addingClient}
                >
                  {addingClient ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <ThemedText style={styles.saveButtonText}>Guardar</ThemedText>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f4f5f7",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
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
    marginLeft: 34,
  },
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
  // Estilos para el modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f1f1f1',
  },
  saveButton: {
    backgroundColor: '#28a745',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});