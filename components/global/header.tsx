import { useAuth } from "@/contexts/AuthProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ThemedText";

const Header = () => {
  const { logout, user } = useAuth();
  const [showCerrarSesion, setShowCerrarSesion] = useState(false);

  const cancelLogout = () => {
    setShowCerrarSesion(false);
  };

  return (
    <>
      {/* Encabezado */}
      <LinearGradient
        colors={["#4a00e0", "#8e2de2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View>
          <ThemedText style={styles.headerTitle}>AppStock</ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Bienvenido, {user?.name}
          </ThemedText>
        </View>
        <TouchableOpacity onPress={() => setShowCerrarSesion(true)} testID="logout">
          <MaterialCommunityIcons name="logout" size={28} color="white" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Modal de confirmación para eliminar producto */}
      <Modal
        visible={showCerrarSesion}
        animationType="fade"
        transparent={true}
        onRequestClose={cancelLogout}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmationModalContent}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={50}
              color="#dc3545"
              style={styles.confirmationIcon}
            />
            <ThemedText style={styles.confirmationTitle}>
              ¿Cerrar sesión?
            </ThemedText>
            <ThemedText style={styles.confirmationMessage}>
              Estás a punto de cerrar sesión, ¿estás seguro?
            </ThemedText>

            <View style={styles.confirmationButtons}>
              <TouchableOpacity
                style={[styles.confirmationButton, styles.cancelButton]}
                onPress={cancelLogout}
              >
                <ThemedText style={styles.cancelButtonText}>
                  Cancelar
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.confirmationButton, styles.deleteConfirmButton]}
                onPress={logout}
              >
                <ThemedText style={styles.deleteButtonText}>
                  Confirmar
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  confirmationModalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  confirmationIcon: {
    marginBottom: 16,
  },
  confirmationTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
    color: "#333",
  },
  confirmationMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  confirmationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 12,
  },
  confirmationButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteConfirmButton: {
    backgroundColor: "#dc3545",
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#f1f1f1",
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
});
export default Header;
