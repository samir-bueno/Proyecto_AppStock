import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "../ThemedText";


export const CuentasDeFiado = () => {
    return (
        <>
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
        </>
    );
};

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
});