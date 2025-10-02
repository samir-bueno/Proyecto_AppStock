import { ThemedText } from '@/components/ThemedText';
import { ActivityIndicator, Modal, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Product } from '../../app/(tabs)/inventario';


type NewProduct = { product_name: string; quantity: string; price: string; barcode: string };


type Props = {
  visible: boolean;
  mode: 'add' | 'edit';
  onClose: () => void;
  onSave: () => void;
  saving: boolean;
  newProduct: NewProduct;
  setNewProduct?: (p: NewProduct) => void;
  editingProduct?: Product | null;
  setEditingProduct?: (p: Product | null) => void;
};


export default function ProductFormModal({ visible, mode, onClose, onSave, saving, newProduct, setNewProduct, editingProduct, setEditingProduct }: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ThemedText style={styles.modalTitle}>{mode === 'add' ? 'Agregar Nuevo Producto' : 'Editar Producto'}</ThemedText>


          <TextInput style={styles.input} placeholder="Nombre del producto *" value={mode === 'add' ? newProduct.product_name : editingProduct?.product_name || ''} onChangeText={(text) => setNewProduct ? setNewProduct({...newProduct, product_name: text}) : null} placeholderTextColor="#999" />
          <TextInput style={styles.input} placeholder="Cantidad *" value={mode === 'add' ? newProduct.quantity : editingProduct?.quantity || ''} onChangeText={(text) => setNewProduct ? setNewProduct({...newProduct, quantity: text}) : null} keyboardType="numeric" placeholderTextColor="#999" />
          <TextInput style={styles.input} placeholder="Precio *" value={mode === 'add' ? newProduct.price : editingProduct?.price || ''} onChangeText={(text) => setNewProduct ? setNewProduct({...newProduct, price: text}) : null} keyboardType="numeric" placeholderTextColor="#999" />
          <TextInput style={styles.input} placeholder="Código de barras (opcional)" value={mode === 'add' ? newProduct.barcode : editingProduct?.barcode || ''} onChangeText={(text) => setNewProduct ? setNewProduct({...newProduct, barcode: text}) : null} placeholderTextColor="#999" />


          <View style={styles.modalButtons}>
            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={onClose} disabled={saving}>
              <ThemedText style={styles.cancelButtonText}>Cancelar</ThemedText>
            </TouchableOpacity>


            <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={onSave} disabled={saving}>
              {saving ? <ActivityIndicator color="white" /> : <ThemedText style={styles.saveButtonText}>{mode === 'add' ? 'Guardar' : 'Actualizar'}</ThemedText>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}


const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: 'white', borderRadius: 12, padding: 20, width: '100%', maxWidth: 400 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 16 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  modalButton: { flex: 1, padding: 15, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
  cancelButton: { backgroundColor: '#f1f1f1' },
  saveButton: { backgroundColor: '#28a745' },
  cancelButtonText: { color: '#333', fontWeight: 'bold' },
  saveButtonText: { color: 'white', fontWeight: 'bold' },
});


