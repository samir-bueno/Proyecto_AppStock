import { ThemedText } from '@/components/ThemedText';
import { useBarcodeScanner } from '@/hooks/useBarcodeScanner';
import { Ionicons } from '@expo/vector-icons';
import { CameraView } from 'expo-camera';
import React from 'react';
import { Alert, Dimensions, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';

interface BarcodeScannerModalProps {
  visible: boolean;
  onClose: () => void;
  onBarcodeScanned: (barcode: string) => void;
}

const { width, height } = Dimensions.get('window');

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  visible,
  onClose,
  onBarcodeScanned,
}) => {
  const { hasPermission, permission, requestPermission, scanned, handleBarcodeScanned, resetScanner } = useBarcodeScanner();

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (data && data.trim().length > 0 && !scanned) {
      onBarcodeScanned(data.trim());
      onClose();
    }
  };

  const requestCameraPermission = async () => {
    const result = await requestPermission();
    if (!result.granted) {
      Alert.alert(
        'Permiso requerido',
        'Se necesita acceso a la cámara para escanear códigos de barras.'
      );
    }
  };

  if (!visible) return null;

  // Si no hay permisos
  if (!hasPermission) {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={visible}
        onRequestClose={onClose}
        testID="camera-modal"
      >
        <View style={styles.permissionContainer} testID="camera-permission-screen">
          <ThemedText style={styles.permissionTitle}>
            Permiso de Cámara Requerido
          </ThemedText>
          <ThemedText style={styles.permissionText}>
            Necesitamos acceso a tu cámara para escanear códigos de barras.
          </ThemedText>
          <TouchableOpacity 
            style={styles.permissionButton}
            onPress={requestCameraPermission}
          >
            <ThemedText style={styles.permissionButtonText}>
              Conceder Permiso
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.permissionButton, styles.cancelButton]}
            onPress={onClose}
          >
            <ThemedText style={styles.cancelButtonText}>
              Cancelar
            </ThemedText>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
      testID="camera-modal"
    >
      <View style={styles.container} testID="camera-active-screen">
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: [
              'ean13',
              'ean8',
              'upc_a',
              'upc_e',
              'code128',
              'code39',
              'code93',
              'itf14',
              'codabar'
            ],
          }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        />
        
        {/* Overlay con marco para escanear */}
        <View style={styles.overlay}>
          <View style={styles.unfocusedContainer} />
          <View style={styles.middleContainer}>
            <View style={styles.unfocusedContainer} />
            <View style={styles.focusedContainer}>
              <View style={styles.cornerTopLeft} />
              <View style={styles.cornerTopRight} />
              <View style={styles.cornerBottomLeft} />
              <View style={styles.cornerBottomRight} />
            </View>
            <View style={styles.unfocusedContainer} />
          </View>
          <View style={styles.unfocusedContainer} />
        </View>

        {/* Botón de cerrar */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={30} color="white" />
        </TouchableOpacity>

        {/* Instrucciones */}
        <View style={styles.instructionContainer}>
          <ThemedText style={styles.instructionText}>
            Enfoca el código de barras dentro del marco
          </ThemedText>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  overlay: {
    flex: 1,
  },
  unfocusedContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  middleContainer: {
    flexDirection: 'row',
    flex: 1.5,
  },
  focusedContainer: {
    flex: 6,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderLeftWidth: 4,
    borderTopWidth: 4,
    borderColor: 'white',
    width: 40,
    height: 40,
  },
  cornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderColor: 'white',
    width: 40,
    height: 40,
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderColor: 'white',
    width: 40,
    height: 40,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderColor: 'white',
    width: 40,
    height: 40,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 5,
  },
  instructionContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 8,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
    lineHeight: 22,
  },
  permissionButton: {
    backgroundColor: '#4a00e0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f1f1f1',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});