import { ThemedText } from "@/components/ThemedText";
import { Product } from "@/services/pocketbaseServices";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FlatList, ListRenderItem, StyleSheet, View } from "react-native";



type Props = {
  products: Product[];
  renderizarProductos: ListRenderItem<Product>;
};

const ListaDeProductos: React.FC<Props> = ({ products = [], renderizarProductos }) => {
  return (
    <>
      {products.length > 0 ? (
        <FlatList
          data={products}
          renderItem={renderizarProductos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons
            name="package-variant"
            size={50}
            color="#ccc"
          />
          <ThemedText style={styles.emptyStateText}>
            No tienes productos registrados
          </ThemedText>
        </View>
      )}
    </>
  );
};

export default ListaDeProductos;

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 80,
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
});
