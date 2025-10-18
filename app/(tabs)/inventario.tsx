import Header from "@/components/global/header";
import AgregarProducto from "@/components/inventario/agregar_producto";
import FormularioParaAgregarUnProducto from "@/components/inventario/agregar_producto/formulario_para_agregar_producto";
import ListaDeProductos from "@/components/inventario/lista_de_productos";
import TarjetaTituloInventario from "@/components/inventario/tarjetaTituloInventario";
import { ThemedText } from "@/components/ThemedText";
import { useAuth } from "@/contexts/AuthProvider";
import {
  createProduct,
  deleteProduct,
  getProductsByOwner,
  Product,
  updateProduct,
} from "@/services/pocketbaseServices";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

// Interfaces para TypeScript
interface NewProduct {
  product_name: string;
  quantity: string;
  price: string;
  barcode: string;
}

// Función para mapear los datos de PocketBase a nuestra interfaz Product
export const mapRecordToProduct = (record: any): Product => ({
  id: record.id,
  product_name: record.product_name || "",
  quantity: record.quantity || "0",
  owner_id: record.owner_id || "",
  price: record.price || "0",
  barcode: record.barcode || "",
  created: record.created,
  updated: record.updated,
});

export default function InventarioScreen() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [addingProduct, setAddingProduct] = useState(false);
  const [updatingProduct, setUpdatingProduct] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState(false);

  // Función para cargar productos desde PocketBase
  const loadProducts = async () => {
    if (!user) return;
    setLoading(true);
    const result = await getProductsByOwner(user.id);
    if (result.success) {
      // Mapear los datos de PocketBase a nuestra interfaz Product
      const mappedProducts = result.data
        ? result.data.map(mapRecordToProduct)
        : [];
      setProducts(mappedProducts);
    } else {
      Alert.alert("Error", result.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, [user]);

  // Función para agregar nuevo producto
  const handleAddNewProduct = (productData: {
    nombre: string;
    cantidad: string;
    precio: string;
    codigo_barras?: string;
  }) => {
    (async () => {
      if (!user) {
        Alert.alert("Error", "No hay usuario autenticado");
        return;
      }

      setAddingProduct(true);
      // Adaptamos los datos para que coincidan con lo que espera createProduct
      const result = await createProduct({
        product_name: productData.nombre,
        quantity: productData.cantidad,
        price: productData.precio,
        barcode: productData.codigo_barras,
        owner_id: user.id,
      });

      if (result.success) {
        Alert.alert("Éxito", "Producto agregado correctamente");
        await loadProducts(); // Recargamos la lista para ver el nuevo producto
        setShowAddForm(false);
      } else {
        Alert.alert("Error", result.error);
      }
      setAddingProduct(false);
    })();
  };

  // Función para actualizar producto
  const handleEditProduct = (productData: {
    nombre: string;
    cantidad: string;
    precio: string;
    codigo_barras?: string;
  }) => {
    if (!editingProduct) return;

    (async () => {
      if (!user) {
        Alert.alert("Error", "No hay usuario autenticado");
        return;
      }

      setUpdatingProduct(true);
      // Adaptamos los datos para que coincidan con lo que espera updateProduct
      const result = await updateProduct(editingProduct.id, {
        product_name: productData.nombre,
        quantity: productData.cantidad,
        price: productData.precio,
        barcode: productData.codigo_barras,
        owner_id: user.id,
      });

      if (result.success) {
        Alert.alert("Éxito", "Producto actualizado correctamente");
        await loadProducts(); // Recargamos la lista para ver el producto actualizado
        setShowEditForm(false);
        setEditingProduct(null);
      } else {
        Alert.alert("Error", result.error);
      }
      setUpdatingProduct(false);
    })();
  };

  // Función para abrir modal de confirmación de eliminación
  const openDeleteConfirmation = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  // Función para eliminar producto
  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;

    setDeletingProduct(true);
    const result = await deleteProduct(productToDelete.id);

    if (result.success) {
      await loadProducts(); // Recargamos la lista
      Alert.alert("Éxito", "Producto eliminado correctamente");
    } else {
      Alert.alert("Error", result.error || "Error al eliminar el producto");
    }

    setDeletingProduct(false);
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  // Función para cancelar eliminación
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  // Función para aumentar/disminuir cantidad
  const updateQuantity = async (productId: string, change: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const currentQuantity = parseInt(product.quantity || "0");
    const newQuantity = Math.max(0, currentQuantity + change);

    const result = await updateProduct(productId, {
      ...product,
      quantity: newQuantity.toString(),
    });
    if (result.success) {
      await loadProducts(); // Recargamos la lista
    } else {
      Alert.alert("Error", result.error);
    }
  };

  // Abrir modal de edición
  const openEditModal = (product: Product) => {
    setEditingProduct({ ...product });
    setShowEditForm(true);
  };

  const renderProductItem = ({ item }: { item: Product }) => {
    const isAgotado = parseInt(item.quantity || "0") === 0;

    return (
      <View style={styles.productItem}>
        {/* Etiqueta AGOTADO encima del producto */}
        {isAgotado && (
          <View style={styles.agotadoBadge}>
            <ThemedText style={styles.agotadoBadgeText}>AGOTADO</ThemedText>
          </View>
        )}

        <View style={styles.productInfo}>
          <ThemedText style={styles.productName}>
            {item.product_name}
          </ThemedText>
          <ThemedText style={styles.productPrice}>${item.price}</ThemedText>
          <ThemedText style={styles.productBarcode}>
            {item.barcode || "No hay código de barras"}
          </ThemedText>
        </View>

        <View style={styles.quantityControls}>
          <TouchableOpacity
            style={[
              styles.quantityButton,
              isAgotado && styles.quantityButtonDisabled,
            ]}
            onPress={() => updateQuantity(item.id, -1)}
            disabled={isAgotado}
          >
            <MaterialCommunityIcons
              name="minus"
              size={20}
              color={isAgotado ? "#ccc" : "white"}
            />
          </TouchableOpacity>

          <ThemedText style={styles.quantityText}>
            {item.quantity || "0"}
          </ThemedText>

          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, 1)}
          >
            <MaterialCommunityIcons name="plus" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => openEditModal(item)}
            testID="edit-button"
          >
            <MaterialCommunityIcons name="pencil" size={20} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => openDeleteConfirmation(item)}
            testID="delete-button"
          >
            <MaterialCommunityIcons name="delete" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a00e0" />
          <ThemedText style={styles.loadingText}>
            Cargando productos...
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <Header />

      <View style={styles.container}>
        <TarjetaTituloInventario />

        {/* Lista de productos */}

        <ListaDeProductos
          products={products}
          renderizarProductos={renderProductItem}
        />
        <AgregarProducto AbrirFormulario={() => setShowAddForm(true)} />

        {/* Modal para agregar nuevo producto */}
        <Modal
          visible={showAddForm}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowAddForm(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <FormularioParaAgregarUnProducto
                alCerrarElFormulario={() => setShowAddForm(false)}
                alGuardarLosDatosDelFormulario={handleAddNewProduct}
                agregandoProducto={addingProduct}
              />
            </View>
          </View>
        </Modal>

        {/* Modal para editar producto */}
        <Modal
          visible={showEditForm}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowEditForm(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <FormularioParaAgregarUnProducto
                alCerrarElFormulario={() => {
                  setShowEditForm(false);
                  setEditingProduct(null);
                }}
                alGuardarLosDatosDelFormulario={handleEditProduct}
                agregandoProducto={updatingProduct}
                productoExistente={
                  editingProduct
                    ? {
                        producto: editingProduct.product_name,
                        cantidad: editingProduct.quantity,
                        precio: editingProduct.price,
                        codigo_barras: editingProduct.barcode,
                      }
                    : undefined
                }
              />
            </View>
          </View>
        </Modal>

        {/* Modal de confirmación para eliminar producto */}
        <Modal
          visible={showDeleteModal}
          animationType="fade"
          transparent={true}
          onRequestClose={cancelDelete}
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
                ¿Eliminar producto?
              </ThemedText>
              <ThemedText style={styles.confirmationMessage}>
                Estás a punto de eliminar el producto
                {productToDelete && ` "${productToDelete.product_name}"`}. Esta
                acción no se puede deshacer.
              </ThemedText>

              <View style={styles.confirmationButtons}>
                <TouchableOpacity
                  style={[styles.confirmationButton, styles.cancelButton]}
                  onPress={cancelDelete}
                  disabled={deletingProduct}
                >
                  <ThemedText style={styles.cancelButtonText}>
                    Cancelar
                  </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.confirmationButton,
                    styles.deleteConfirmButton,
                  ]}
                  onPress={confirmDeleteProduct}
                  disabled={deletingProduct}
                >
                  {deletingProduct ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <ThemedText style={styles.deleteButtonText}>
                      Eliminar
                    </ThemedText>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f4f5f7",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
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
    flex: 1,
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
  listContent: {
    paddingBottom: 80,
  },
  productItem: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    position: "relative", // Para posicionar la etiqueta AGOTADO
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
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4a00e0",
    marginBottom: 4,
  },
  productBarcode: {
    fontSize: 14,
    color: "#666",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  quantityButton: {
    backgroundColor: "#4a00e0",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 10,
    color: "#333",
    minWidth: 30,
    textAlign: "center",
  },
  actionButtons: {
    flexDirection: "row",
  },
  editButton: {
    backgroundColor: "#ffa500",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
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
    elevation: 5,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  // Estilos para el modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#f1f1f1",
  },
  saveButton: {
    backgroundColor: "#28a745",
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },

  agotadoBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#dc3545",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    zIndex: 1,
  },
  agotadoBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  quantityButtonDisabled: {
    backgroundColor: "#ccc",
  },
  // Nuevos estilos para el modal de confirmación de eliminación
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
});
