import AgregarClienteFiado from "@/components/fiados/agregar_cliente_fiado";
import ListaDeFiados from "@/components/fiados/lista_de_fiados";
import Tarjeta_fiado from "@/components/fiados/lista_de_fiados/tarjeta_fiado";
import { ThemedText } from "@/components/ThemedText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import FormuloarioParaAgregarUnFiado from "../../components/fiados/agregar_cliente_fiado/formulario_para_agregar_fiado";
// Interfaces para TypeScript
import Header from "@/components/fiados/header";
import { useFiados } from "@/hooks/useFiados";

export default function FiadoScreen() {
  const {
    clients,
    loading,
    showAddForm,
    addingClient,
    errorDuplicado,
    expandedId,
    handleAddNewClient,
    toggleDetails,
    openAddForm,
    closeAddForm,
  } = useFiados();

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a00e0" />
          <ThemedText style={styles.loadingText}>
            Cargando clientes...
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <Header />

      <View style={styles.container}>
        {/* Tarjeta de título */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons
              name="account-cash"
              size={24}
              color="#333"
            />
            <ThemedText style={styles.cardTitle}>Cuentas de Fiado</ThemedText>
          </View>
          <ThemedText style={styles.cardSubtitle}>
            Clientes con crédito activo
          </ThemedText>
        </View>

        {/* Lista de clientes */}
        <ListaDeFiados
          clients={clients}
          renderizarClientes={({ item }) => (
            <Tarjeta_fiado
              item={item}
              isExpanded={expandedId === item.id}
              onToggle={toggleDetails}
            />
          )}
        />

        <AgregarClienteFiado AbrirFormulario={() => openAddForm()} />

        {/* Modal para agregar nuevo cliente */}
        <Modal
          visible={showAddForm}
          animationType="slide"
          transparent={true}
          onRequestClose={() => {
            closeAddForm();
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <FormuloarioParaAgregarUnFiado
                alCerrarElFormulario={() => {
                  closeAddForm();
                }}
                alGuardarLosDatosDelFormulario={handleAddNewClient}
                agregandoCliente={addingClient}
                errorDuplicado={errorDuplicado}
              />
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f4f5f7",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
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
  clientDeuda: {
    fontSize: 24, // Tamaño grande para el monto
    fontWeight: "normal",
    color: "green",
    marginLeft: 10,
    marginRight: 10,
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
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
    textAlign: "center",
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#f1f1f1",
  },
  saveButton: {
    backgroundColor: "#28a745",
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },

  details: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
});
