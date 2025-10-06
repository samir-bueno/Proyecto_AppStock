import { ThemedText } from "@/components/ThemedText";
import { useAuth } from "@/contexts/AuthProvider";
import { createProduct, deleteProduct, getProductsByOwner, updateProduct } from "@/services/pocketBaseService";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text
} from "react-native";

// Interfaces para TypeScript
interface NewProduct {
  product_name: string;
  quantity: string;
  price: string;
  barcode: string;
}

export interface Product {
  id: string;
  product_name: string;
  quantity: string;
  owner_id: string;
  price: string;
  barcode: string;
  created?: string;
  updated?: string;
}

// Función para mapear los datos de PocketBase a nuestra interfaz Product
export const mapRecordToProduct = (record: any): Product => ({
  id: record.id,
  product_name: record.product_name || '',
  quantity: record.quantity || '0',
  owner_id: record.owner_id || '',
  price: record.price || '0',
  barcode: record.barcode || '',
  created: record.created,
  updated: record.updated
});

export default function InventarioScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<NewProduct>({
    product_name: "",
    quantity: "",
    price: "",
    barcode: ""
  });
  const [addingProduct, setAddingProduct] = useState(false);
  const [updatingProduct, setUpdatingProduct] = useState(false);

  // Función para cargar productos desde PocketBase
  const loadProducts = async () => { 
    if (!user) return;
    setLoading(true);
    const result = await getProductsByOwner(user.id);
    if (result.success) {
      // Mapear los datos de PocketBase a nuestra interfaz Product
      const mappedProducts = result.data ? result.data.map(mapRecordToProduct) : [];
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
  const addNewProduct = async () => {
    if (!newProduct.product_name.trim()) {
      Alert.alert("Error", "El nombre del producto es obligatorio");
      return;
    }
    setAddingProduct(true);
    const result = await createProduct({ ...newProduct, owner_id: user?.id });
    if (result.success) {
      await loadProducts(); // Recargamos la lista
      setShowAddForm(false);
      setNewProduct({ product_name: "", quantity: "", price: "", barcode: "" });
      Alert.alert("Éxito", "Producto agregado correctamente");
    } else {
      Alert.alert("Error", result.error);
    }
    setAddingProduct(false);
  };

  // Función para actualizar producto
  const updateExistingProduct = async () => {
    if (!editingProduct) return;
    
    if (!editingProduct.product_name.trim()) {
      Alert.alert("Error", "El nombre del producto es obligatorio");
      return;
    }
    
    setUpdatingProduct(true);
    const result = await updateProduct(editingProduct.id, editingProduct);
    if (result.success) {
      await loadProducts(); // Recargamos la lista
      setShowEditForm(false);
      setEditingProduct(null);
      Alert.alert("Éxito", "Producto actualizado correctamente");
    } else {
      Alert.alert("Error", result.error);
    }
    setUpdatingProduct(false);
  };

  // Función para eliminar producto
  const deleteExistingProduct = async (productId: string) => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que quieres eliminar este producto?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: async () => {
            const result = await deleteProduct(productId);
            if (result.success) {
              await loadProducts(); // Recargamos la lista
              Alert.alert("Éxito", "Producto eliminado correctamente");
            } else {
              <Text>Error: {result.error}</Text>
            }
          }
        }
      ]
    );
  };

  // Función para aumentar/disminuir cantidad
  const updateQuantity = async (productId: string, change: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const currentQuantity = parseInt(product.quantity || "0");
    const newQuantity = Math.max(0, currentQuantity + change);
    
    const result = await updateProduct(productId, { ...product, quantity: newQuantity.toString() });
    if (result.success) {
      await loadProducts(); // Recargamos la lista
    } else {
      Alert.alert("Error", result.error);
    }
  };

  // Abrir modal de edición
  const openEditModal = (product: Product) => {
    setEditingProduct({...product});
    setShowEditForm(true);
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.productItem}>
      <View style={styles.productInfo}>
        <ThemedText style={styles.productName}>{item.product_name}</ThemedText>
        <ThemedText style={styles.productPrice}>${item.price}</ThemedText>
        <ThemedText style={styles.productBarcode}>
          {item.barcode || "No hay código de barras"}
        </ThemedText>
      </View>
      
      <View style={styles.quantityControls}>
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, -1)}
        >
          <MaterialCommunityIcons name="minus" size={20} color="white" />
        </TouchableOpacity>
        
        <ThemedText style={styles.quantityText}>{item.quantity || "0"}</ThemedText>
        
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
        >
          <MaterialCommunityIcons name="pencil" size={20} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => deleteExistingProduct(item.id)}
        >
          <MaterialCommunityIcons name="delete" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a00e0" />
          <ThemedText style={styles.loadingText}>Cargando productos...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

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
      </LinearGradient>

      <View style={styles.container}>
        {/* Tarjeta de título */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="account-cash" size={24} color="#333" />
            <ThemedText style={styles.cardTitle}>Control de inventario</ThemedText>
          </View>
          <ThemedText style={styles.cardSubtitle}>
            Productos en inventario
          </ThemedText>
        </View>

        {/* Lista de productos */}
        {products.length > 0 ? (
          <FlatList
            data={products}
            renderItem={renderProductItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="package-variant" size={50} color="#ccc" />
            <ThemedText style={styles.emptyStateText}>
              No tienes productos registrados
            </ThemedText>
          </View>
        )}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddForm(true)}
        >
          <MaterialCommunityIcons name="plus" size={24} color="white" />
          <ThemedText style={styles.addButtonText}>Agregar Producto</ThemedText>
        </TouchableOpacity>

        {/* Modal para agregar nuevo producto */}
        <Modal
          visible={showAddForm}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowAddForm(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ThemedText style={styles.modalTitle}>Agregar Nuevo Producto</ThemedText>

              <TextInput
                style={styles.input}
                placeholder="Nombre del producto *"
                value={newProduct.product_name}
                onChangeText={(text) => setNewProduct({...newProduct, product_name: text})}
                placeholderTextColor="#999"
              />
              
              <TextInput
                style={styles.input}
                placeholder="Cantidad inicial *"
                value={newProduct.quantity}
                onChangeText={(text) => setNewProduct({...newProduct, quantity: text})}
                keyboardType="numeric"
                placeholderTextColor="#999"
              />

              <TextInput
                style={styles.input}
                placeholder="Precio *"
                value={newProduct.price}
                onChangeText={(text) => setNewProduct({...newProduct, price: text})}
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
              
              <TextInput
                style={styles.input}
                placeholder="Código de barras (opcional)"
                value={newProduct.barcode}
                onChangeText={(text) => setNewProduct({...newProduct, barcode: text})}
                placeholderTextColor="#999"
              />
              
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowAddForm(false)}
                  disabled={addingProduct}
                >
                  <ThemedText style={styles.cancelButtonText}>Cancelar</ThemedText>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={addNewProduct}
                  disabled={addingProduct}
                >
                  {addingProduct ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <ThemedText style={styles.saveButtonText}>Guardar</ThemedText>
                  )}
                </TouchableOpacity>
              </View>
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
              <ThemedText style={styles.modalTitle}>Editar Producto</ThemedText>

              <TextInput
                style={styles.input}
                placeholder="Nombre del producto *"
                value={editingProduct?.product_name || ""}
                onChangeText={(text) => setEditingProduct(prev => prev ? {...prev, product_name: text} : null)}
                placeholderTextColor="#999"
              />
              
              <TextInput
                style={styles.input}
                placeholder="Cantidad *"
                value={editingProduct?.quantity || ""}
                onChangeText={(text) => setEditingProduct(prev => prev ? {...prev, quantity: text} : null)}
                keyboardType="numeric"
                placeholderTextColor="#999"
              />

              <TextInput
                style={styles.input}
                placeholder="Precio *"
                value={editingProduct?.price || ""}
                onChangeText={(text) => setEditingProduct(prev => prev ? {...prev, price: text} : null)}
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
              
              <TextInput
                style={styles.input}
                placeholder="Código de barras (opcional)"
                value={editingProduct?.barcode || ""}
                onChangeText={(text) => setEditingProduct(prev => prev ? {...prev, barcode: text} : null)}
                placeholderTextColor="#999"
              />
              
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowEditForm(false)}
                  disabled={updatingProduct}
                >
                  <ThemedText style={styles.cancelButtonText}>Cancelar</ThemedText>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={updateExistingProduct}
                  disabled={updatingProduct}
                >
                  {updatingProduct ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <ThemedText style={styles.saveButtonText}>Actualizar</ThemedText>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f1f1f1',
  },
  saveButton: {
    backgroundColor: '#28a745',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});