import { VentaProduct } from "@/services/pocketbaseServices";
import React from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

interface ConfirmSaleModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  products: VentaProduct[];
  total: number;
}

const ConfirmSaleModal: React.FC<ConfirmSaleModalProps> = ({
  visible,
  onClose,
  onConfirm,
  products,
  total
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      testID="confirm-sale-modal"
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle} testID="modal-title">Resumen de Venta</Text>
          
          <ScrollView style={styles.productsList} testID="modal-products-list">
            {products.map((product, index) => (
              <View key={product.id} style={styles.productItem} testID={`modal-product-${product.id}`}>
                <Text 
                  style={styles.productName}
                  testID={`modal-product-name-${product.id}`}
                >
                  {product.product_name}
                </Text>
                <Text style={styles.productDetails}>
                  {product.quantityInSale} x ${parseFloat(product.price).toFixed(2)} = 
                  ${(product.quantityInSale * parseFloat(product.price)).toFixed(2)}
                </Text>
              </View>
            ))}
          </ScrollView>
          
          <View style={styles.totalContainer}>
            <Text style={styles.totalText} testID="modal-total">Total: ${total.toFixed(2)}</Text>
          </View>
          
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              testID="modal-cancel-button"
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={onConfirm}
              testID="modal-confirm-button"
            >
              <Text style={styles.buttonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: "80%",
    width: "90%"
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center"
  },
  productsList: {
    width: "100%",
    maxHeight: 200,
    marginBottom: 15
  },
  productItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    width: "100%"
  },
  productName: {
    fontSize: 16,
    flex: 2
  },
  productDetails: {
    fontSize: 14,
    color: "#666",
    flex: 1,
    textAlign: "right",
    
  },
  totalContainer: {
    borderTopWidth: 2,
    borderTopColor: "#333",
    paddingTop: 10,
    marginBottom: 20,
    width: "100%"
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center"
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%"
  },
  button: {
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    minWidth: "45%"
  },
  cancelButton: {
    backgroundColor: "#ff4444",
  },
  confirmButton: {
    backgroundColor: "#28a745",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  }
});

export default ConfirmSaleModal;