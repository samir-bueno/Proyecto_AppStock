import { Product } from "@/services/pocketbaseServices";
import { FontAwesome } from "@expo/vector-icons";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { ThemedText } from "../ThemedText";

const BusquedaProductos = ({
  agregarProducto,
  valorBusqueda,
  setValorBusqueda,
  elBuscadorSeMuestra,
  setElBuscadorSeMuestra,
  filtrarProductos,
  cargando,
}: {
  agregarProducto: (producto: Product) => void;
  valorBusqueda: string;
  setValorBusqueda: (valorBusqueda: string) => void;
  elBuscadorSeMuestra: boolean;
  setElBuscadorSeMuestra: (elBuscadorSeMuestra: boolean) => void;
  filtrarProductos: Product[];
  cargando: boolean;

}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <FontAwesome name="search" size={22} color="#333" />
        <ThemedText style={styles.cardTitle}>Buscar Producto</ThemedText>
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por nombre..."
        placeholderTextColor="#999"
        value={valorBusqueda}
        onChangeText={setValorBusqueda}
        onFocus={() => setElBuscadorSeMuestra(true)}
      />
      {elBuscadorSeMuestra && !cargando && (
        <FlatList
          nestedScrollEnabled={true}
          data={filtrarProductos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.productItem}
              onPress={() => {
                agregarProducto(item);
              }}
            >
              <ThemedText style={styles.productName}>
                {item.product_name}
              </ThemedText>
              <ThemedText style={styles.productDetails}>
                Precio: ${item.price} | Cantidad: {item.quantity}
              </ThemedText>
            </TouchableOpacity>
          )}
          style={styles.resultsList}
          ListEmptyComponent={
            <ThemedText style={styles.noResults}>
              {valorBusqueda
                ? "No se encontraron productos"
                : "No hay productos en tu inventario"}
            </ThemedText>
          }
        />
      )}
      {cargando && elBuscadorSeMuestra && (
        <ActivityIndicator size="small" color="#0000ff" />
      )}
    </View>
  );
};
export default BusquedaProductos;

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
  searchInput: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    borderColor: "#ddd",
    borderWidth: 1,
    color: "#333",
  },
  productItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  productDetails: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  noResults: {
    textAlign: "center",
    color: "#999",
    marginVertical: 20,
  },
  resultsList: {
    maxHeight: 300,
  },
});