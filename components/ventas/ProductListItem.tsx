import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Product } from "../../app/(tabs)/inventario";
import { ThemedText } from "../ThemedText";

type Props = {
  product: Product;
  onPress?: (p: Product) => void;
};

export default function ProductListItem({ product, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.productItem} onPress={() => onPress && onPress(product)}>
      <View style={styles.productInfo}>
        <ThemedText style={styles.productName}>{product.product_name}</ThemedText>
        <ThemedText style={styles.productDetails}>Precio: ${product.price} | Cantidad: {product.quantity}</ThemedText>
      </View>
    </TouchableOpacity>
  );
}
 
const styles = StyleSheet.create({
  productItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
  productInfo: { flex: 1 },
  productName: { fontSize: 16, fontWeight: "600", color: "#333", marginBottom: 4 },
  productDetails: { fontSize: 14, color: "#666", marginBottom: 4 },
});
