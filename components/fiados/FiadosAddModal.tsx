import React from 'react';
import { Modal, View, TextInput, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

interface FiadosAddModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  newClient: { name: string; phone: string };
  setNewClient: (client: { name: string; phone: string }) => void;
  addingClient: boolean;
}

export default function FiadosAddModal({ visible, onClose, onSave, newClient, setNewClient, addingClient }: FiadosAddModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Agregar nuevo cliente</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={newClient.name}
            onChangeText={text => setNewClient({ ...newClient, name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Teléfono (opcional)"
            value={newClient.phone}
            onChangeText={text => setNewClient({ ...newClient, phone: text })}
            keyboardType="phone-pad"
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={onClose} disabled={addingClient}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={onSave} disabled={addingClient}>
              {addingClient ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.saveButtonText}>Guardar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
