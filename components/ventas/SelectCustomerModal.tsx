import { Customer } from "@/services/pocketbaseServices";
import React from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { ThemedText } from "../ThemedText";

interface SelectCustomerModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (customer: Customer) => void;
  customers: Customer[];
  total: number;
}

const SelectCustomerModal: React.FC<SelectCustomerModalProps> = ({
  visible,
  onClose,
  onConfirm,
  customers,
  total
}) => {
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null);

  const handleConfirm = () => {
    if (!selectedCustomer) {
      Alert.alert("Error", "Debes seleccionar un cliente para venta fiada");
      return;
    }
    onConfirm(selectedCustomer);
    setSelectedCustomer(null); // Resetear selección
  };

  const handleClose = () => {
    setSelectedCustomer(null);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
      testID="select-customer-modal"
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ThemedText style={styles.modalTitle}>Seleccionar Cliente Fiado</ThemedText>
          <ThemedText style={styles.totalText}>Total a fiar: ${total.toFixed(2)}</ThemedText>
          
          <ScrollView style={styles.customersList}>
            {customers.length === 0 ? (
              <ThemedText style={styles.noCustomersText}>
                No hay clientes fiados registrados
              </ThemedText>
            ) : (
              customers.map((customer) => (
                <TouchableOpacity
                  key={customer.id}
                  style={[
                    styles.customerItem,
                    selectedCustomer?.id === customer.id && styles.selectedCustomer
                  ]}
                  onPress={() => setSelectedCustomer(customer)}
                  testID={`customer-item-${customer.id}`}
                >
                  <View style={styles.customerInfo}>
                    <ThemedText style={styles.customerName}>
                      {customer.name}
                    </ThemedText>
                    <ThemedText style={styles.customerPhone}>
                      {customer.phone || "Sin teléfono"}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.customerDebt}>
                    Deuda Actual: ${parseFloat(customer.deuda).toFixed(2)}
                  </ThemedText>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
          
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
              testID="modal-cancel-customer-button"
            >
              <ThemedText style={styles.buttonText}>Cancelar</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.button, 
                styles.confirmButton,
                !selectedCustomer && styles.disabledButton
              ]}
              onPress={handleConfirm}
              disabled={!selectedCustomer}
              testID="modal-confirm-customer-button"
            >
              <ThemedText style={styles.buttonText}>
                {selectedCustomer ? "Confirmar Fiado" : "Selecciona Cliente"}
              </ThemedText>
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: "80%",
    width: "90%"
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333"
  },
  totalText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#ff6b35"
  },
  customersList: {
    width: "100%",
    maxHeight: 300,
    marginBottom: 15
  },
  noCustomersText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    padding: 20
  },
  customerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    borderRadius: 8,
    marginBottom: 8
  },
  selectedCustomer: {
    backgroundColor: "#e3f2fd",
    borderColor: "#2196F3",
    borderWidth: 1
  },
  customerInfo: {
    flex: 2
  },
  customerName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333"
  },
  customerPhone: {
    fontSize: 14,
    color: "#666"
  },
  customerDebt: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ff4444"
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
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  }
});

export default SelectCustomerModal;