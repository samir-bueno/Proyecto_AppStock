import { VentaProduct } from "@/services/pocketbaseServices";
import { FontAwesome } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ThemedText";
const VentaActual = ({
  productosEnVenta,
  handleQuantityChange,
}: {
  productosEnVenta: VentaProduct[];
  handleQuantityChange: (productId: string, change: number) => void;
}) => {
  return (
    <>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <FontAwesome name="cart-plus" size={22} color="#333" />
          <ThemedText style={styles.cardTitle}>Venta Actual</ThemedText>
        </View>

        {productosEnVenta.length === 0 ? (
          <View style={styles.venta}>
            <ThemedText darkColor="#999">
              No hay productos en la venta
            </ThemedText>
          </View>
        ) : (
          <View>
            {productosEnVenta.map((item) => (
              <View key={item.id} style={styles.saleItem}>
                <View style={styles.saleItemInfo}>
                  <ThemedText style={styles.saleItemName}>
                    {item.product_name}
                  </ThemedText>
                  <ThemedText style={styles.saleItemDetails}>
                    ${item.price} x {item.quantityInSale}
                  </ThemedText>
                </View>
                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    onPress={() => handleQuantityChange(item.id, -1)}
                    style={styles.quantityButton}
                  >
                    <ThemedText style={styles.quantityButtonText}>-</ThemedText>
                  </TouchableOpacity>
                  <ThemedText style={styles.quantityText}>
                    {item.quantityInSale}
                  </ThemedText>
                  <TouchableOpacity
                    onPress={() => handleQuantityChange(item.id, 1)}
                    style={styles.quantityButton}
                  >
                    <ThemedText style={styles.quantityButtonText}>+</ThemedText>
                  </TouchableOpacity>
                </View>
                <ThemedText style={styles.saleItemTotal}>
                  ${Number(item.price) * item.quantityInSale}
                </ThemedText>
              </View>
            ))}
            <View style={styles.totalContainer}>
              <ThemedText style={styles.totalTextLabel}>Total:</ThemedText>
              <ThemedText style={styles.totalTextValue}>
                $
                {productosEnVenta
                  .reduce(
                    (sum, item) =>
                      sum + Number(item.price) * item.quantityInSale,
                    0
                  )
                  .toFixed(2)}
              </ThemedText>
            </View>
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.normalButton]}
              >
                <ThemedText style={styles.actionButtonText}>
                  Venta Normal
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.fiadoButton]}
              >
                <ThemedText style={styles.actionButtonText}>
                  Venta Fiado
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </>
  );
};
export default VentaActual;

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
  venta: {
    alignItems: "center",
  },
  saleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  saleItemInfo: {
    flex: 2,
  },
  saleItemName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  saleItemDetails: {
    fontSize: 14,
    color: "#444",
  },
  quantityControls: {
    flex: 1.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
  },
  saleItemTotal: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
    color: "#85bb65",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  totalTextLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  totalTextValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#85bb65",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  normalButton: {
    backgroundColor: "#28a745",
    marginRight: 10,
  },
  fiadoButton: {
    backgroundColor: "#007bff",
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});