import { ThemedText } from "@/components/ThemedText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";

const AgregarClienteFiado = ({ AbrirFormulario }: { AbrirFormulario: () => void }) => {

    return (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => AbrirFormulario()}
          accessibilityLabel="Agregar Cliente Fiado"
          accessibilityRole="button"
        >
          <MaterialCommunityIcons name="plus" size={24} color="white" />
          <ThemedText style={styles.addButtonText}>Agregar Cliente Fiado</ThemedText>
        </TouchableOpacity>
    );
};

export default AgregarClienteFiado;

const styles = StyleSheet.create({
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
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});