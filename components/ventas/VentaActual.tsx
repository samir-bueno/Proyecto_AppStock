import { ThemedText } from "@/components/ThemedText";
import { StyleSheet, View } from "react-native";


type Props = {
  items?: any[];
};


export default function VentaActual({ items = [] }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <ThemedText style={styles.cardTitle}>Venta Actual</ThemedText>
      </View>
      <View style={styles.venta}>
        <ThemedText darkColor="#999">{items.length === 0 ? "No hay productos en la venta" : `${items.length} productos`}</ThemedText>
      </View>
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
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  cardTitle: { fontSize: 18, fontWeight: "600", marginLeft: 10, color: "#333" },
  venta: { alignItems: "center" },
});


