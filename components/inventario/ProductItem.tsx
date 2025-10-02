import { ThemedText } from '@/components/ThemedText';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Product } from '../../app/(tabs)/inventario';


type Props = {
  item: Product;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
};


export default function ProductItem({ item, onIncrease, onDecrease, onEdit, onDelete }: Props) {
  return (
    <View style={styles.productItem}>
      <View style={styles.productInfo}>
        <ThemedText style={styles.productName}>{item.product_name}</ThemedText>
        <ThemedText style={styles.productPrice}>${item.price}</ThemedText>
        <ThemedText style={styles.productBarcode}>{item.barcode || 'No hay código de barras'}</ThemedText>
      </View>


      <View style={styles.quantityControls}>
        <TouchableOpacity style={styles.quantityButton} onPress={() => onDecrease(item.id)}>
          <MaterialCommunityIcons name="minus" size={20} color="white" />
        </TouchableOpacity>


        <ThemedText style={styles.quantityText}>{item.quantity || '0'}</ThemedText>


        <TouchableOpacity style={styles.quantityButton} onPress={() => onIncrease(item.id)}>
          <MaterialCommunityIcons name="plus" size={20} color="white" />
        </TouchableOpacity>
      </View>


      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.editButton} onPress={() => onEdit(item)}>
          <MaterialCommunityIcons name="pencil" size={20} color="white" />
        </TouchableOpacity>


        <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(item.id)}>
          <MaterialCommunityIcons name="delete" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  productItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productInfo: { flex: 1 },
  productName: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 },
  productPrice: { fontSize: 16, fontWeight: 'bold', color: '#4a00e0', marginBottom: 4 },
  productBarcode: { fontSize: 14, color: '#666' },
  quantityControls: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 },
  quantityButton: { backgroundColor: '#4a00e0', width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  quantityText: { fontSize: 16, fontWeight: 'bold', marginHorizontal: 10, color: '#333', minWidth: 30, textAlign: 'center' },
  actionButtons: { flexDirection: 'row' },
  editButton: { backgroundColor: '#ffa500', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  deleteButton: { backgroundColor: '#dc3545', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
});
