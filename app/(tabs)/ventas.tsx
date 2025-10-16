import { ThemedText } from "@/components/ThemedText";
import { useAuth } from "@/contexts/AuthProvider";
import { getProductsByOwner, Product } from "@/services/pocketbaseServices";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import "react-native-gesture-handler";
import { mapRecordToProduct } from "./inventario";

interface VentaProduct extends Product {
  quantityInSale: number;
}

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [busqueda, setbusqueda] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [ventaActual, setVentaActual] = useState<VentaProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const agregarProductoAVenta = (producto: Product) => {
    setVentaActual((prevVenta) => {
      const productoExistente = prevVenta.find((p) => p.id === producto.id);

      if (productoExistente) {
        // Si el producto ya está en la venta, incrementa su cantidad
        return prevVenta.map((p) =>
          p.id === producto.id
            ? { ...p, quantityInSale: p.quantityInSale + 1 }
            : p
        );
      } else {
        // Si es un producto nuevo, lo añade con cantidad 1
        return [...prevVenta, { ...producto, quantityInSale: 1 }];
      }
    });
    // Opcional: Limpiar la búsqueda y ocultar la lista después de seleccionar
    setbusqueda("");
    setIsSearchFocused(false);
  };

  const handleQuantityChange = (productId: string, amount: number) => {
    setVentaActual((prevVenta) => {
      const updatedVenta = prevVenta.map((p) =>
        p.id === productId
          ? { ...p, quantityInSale: Math.max(0, p.quantityInSale + amount) }
          : p
      );
      // Filtra y elimina los productos cuya cantidad llegue a 0
      return updatedVenta.filter((p) => p.quantityInSale > 0);
    });
  };
  const loadProducts = async () => {
    if (!user) return;
    setLoading(true);
    const result = await getProductsByOwner(user.id);
    if (result.success) {
      const mappedProducts = result.data
        ? result.data.map(mapRecordToProduct)
        : [];
      setProducts(mappedProducts);
      setFilteredProducts(mappedProducts);
    } else {
      console.error(result.error);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [user])
  );

  useEffect(() => {
    if (busqueda === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.product_name.toLowerCase().includes(busqueda.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [products, busqueda]);

  const handleLogout = () => {
    logout();
    router.replace("/(Auth)/login");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

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
        <TouchableOpacity onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={28} color="white" />
        </TouchableOpacity>
      </LinearGradient>

      <FlatList
        style={styles.container}
        data={[]} // Sin datos, solo la usamos para el layout
        keyExtractor={(item, index) => index.toString()}
        renderItem={null}
        keyboardShouldPersistTaps="handled" 
        ListHeaderComponent={
          <>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons
                  name="scan-helper"
                  size={24}
                  color="#333"
                />
                <ThemedText style={styles.cardTitle}>
                  Escanear Producto
                </ThemedText>
              </View>
              <TouchableOpacity style={styles.scanButton}>
                <FontAwesome
                  name="barcode"
                  size={24}
                  color="white"
                  style={styles.buttonIcon}
                />
                <ThemedText style={styles.scanButtonText}>
                  Escanear Código de Barras
                </ThemedText>
              </TouchableOpacity>
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <FontAwesome name="search" size={22} color="#333" />
                <ThemedText style={styles.cardTitle}>
                  Buscar Producto
                </ThemedText>
              </View>
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar por nombre..."
                placeholderTextColor="#999"
                value={busqueda}
                onChangeText={setbusqueda}
                onFocus={() => setIsSearchFocused(true)}
              />
              {isSearchFocused && !loading && (
                <FlatList
                  nestedScrollEnabled={true}
                  data={filteredProducts}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.productItem}
                      onPress={() => {
                        agregarProductoAVenta(item);
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
                      {busqueda
                        ? "No se encontraron productos"
                        : "No hay productos en tu inventario"}
                    </ThemedText>
                  }
                />
              )}
              {loading && isSearchFocused && (
                <ActivityIndicator size="small" color="#0000ff" />
              )}
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <FontAwesome name="cart-plus" size={22} color="#333" />
                <ThemedText style={styles.cardTitle}>Venta Actual</ThemedText>
              </View>

              {ventaActual.length === 0 ? (
                <View style={styles.venta}>
                  <ThemedText darkColor="#999">
                    No hay productos en la venta
                  </ThemedText>
                </View>
              ) : (
                <View>
                  {ventaActual.map((item) => (
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
                          <ThemedText style={styles.quantityButtonText}>
                            -
                          </ThemedText>
                        </TouchableOpacity>
                        <ThemedText style={styles.quantityText}>
                          {item.quantityInSale}
                        </ThemedText>
                        <TouchableOpacity
                          onPress={() => handleQuantityChange(item.id, 1)}
                          style={styles.quantityButton}
                        >
                          <ThemedText style={styles.quantityButtonText}>
                            +
                          </ThemedText>
                        </TouchableOpacity>
                      </View>
                      <ThemedText style={styles.saleItemTotal}>
                        ${(Number(item.price) * item.quantityInSale)}
                      </ThemedText>
                    </View>
                  ))}
                  <View style={styles.totalContainer}>
                    <ThemedText style={styles.totalTextLabel}>
                      Total:
                    </ThemedText>
                    <ThemedText style={styles.totalTextValue}>
                      $
                      {ventaActual
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
        }
      />
    </SafeAreaView>
  );
}

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
  container: {
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
  buttonIcon: {
    marginRight: 10,
  },
  scanButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
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
  venta: {
    alignItems: "center",
  },
  loader: {
    marginVertical: 10,
  },
  resultsList: {
    maxHeight: 300,
  },
  productItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  productInfo: {
    flex: 1,
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
  productBarcode: {
    fontSize: 12,
    color: "#999",
  },
  noResults: {
    textAlign: "center",
    color: "#999",
    marginVertical: 20,
  },
  searchResults: {
    padding: 20,
    marginBottom: 20,
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
