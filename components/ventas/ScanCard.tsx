import { ThemedText } from "@/components/ThemedText";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";


type Props = {
  onScan?: () => void;
};


export default function ScanCard({ onScan }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <MaterialCommunityIcons name="scan-helper" size={24} color="#333" />
        <ThemedText style={styles.cardTitle}>Escanear Producto</ThemedText>
      </View>
      <TouchableOpacity style={styles.scanButton} onPress={onScan}>
        <FontAwesome name="barcode" size={24} color="white" style={styles.buttonIcon} />
        <ThemedText style={styles.scanButtonText}>Escanear Código de Barras</ThemedText>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
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
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
    color: "#333",
  },
  scanButton: {
    backgroundColor: "#28a745",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 8,
  },
  buttonIcon: { marginRight: 10 },
  scanButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
