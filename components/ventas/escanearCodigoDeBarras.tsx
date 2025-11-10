import { ThemedText } from "@/components/ThemedText";
import { useBarcodeScanner } from "@/hooks/useBarcodeScanner";
import { useBarcodeScannerLogic } from "@/hooks/useBarcodeScannerLogic";
import { useCameraState } from "@/hooks/useCameraState";
import { Product } from "@/services/pocketbaseServices";
import { FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { CameraView } from "expo-camera";
import {
  Alert,
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface EscanearCodigoDeBarrasProps {
  onProductoEscaneado: (producto: Product) => void;
  productos: Product[]; // Lista de productos para buscar por código de barras
}

const { width, height } = Dimensions.get("window");

// Componente de cámara COPIADO del inventario
const BarcodeScannerModalVentas: React.FC<{
  visible: boolean;
  onClose: () => void;
  onBarcodeScanned: (barcode: string) => void;
}> = ({ visible, onClose, onBarcodeScanned }) => {
  const {
    hasPermission,
    permission,
    requestPermission,
    scanned,
    handleBarcodeScanned,
    resetScanner,
  } = useBarcodeScanner();

  const handleBarCodeScanned = ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    if (data && data.trim().length > 0 && !scanned) {
      onBarcodeScanned(data.trim());
      onClose();
    }
  };

  const requestCameraPermission = async () => {
    const result = await requestPermission();
    if (!result.granted) {
      Alert.alert(
        "Permiso requerido",
        "Se necesita acceso a la cámara para escanear códigos de barras."
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
        testID="camera-modal-ventas"
      >
        <View
          style={styles.permissionContainer}
          testID="camera-permission-screen-ventas"
        >
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
            <ThemedText style={styles.cancelButtonText}>Cancelar</ThemedText>
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
      testID="camera-modal-ventas"
    >
      <View style={styles.container} testID="camera-active-screen-ventas">
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: [
              "ean13",
              "ean8",
              "upc_a",
              "upc_e",
              "code128",
              "code39",
              "code93",
              "itf14",
              "codabar",
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
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          testID="close-camera-button-ventas"
        >
          <Ionicons name="close" size={30} color="white" />
        </TouchableOpacity>

        {/* Instrucciones */}
        <View style={styles.instructionContainer}>
          <ThemedText style={styles.instructionText} testID="camera-instructions-ventas">
            Enfoca el código de barras dentro del marco
          </ThemedText>
        </View>
      </View>
    </Modal>
  );
};

// Componente principal de escaneo
const EscanearCodigoDeBarras = ({ onProductoEscaneado, productos }: EscanearCodigoDeBarrasProps) => {
  const { showScanner, openCamera, closeCamera } = useCameraState();
  const { mensajeError, handleBarcodeScanned } = useBarcodeScannerLogic(productos, onProductoEscaneado);

  const handleBarcodeScannedWithClose = (barcode: string) => {
    handleBarcodeScanned(barcode);
    closeCamera();
  };

  return (
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
      
      <TouchableOpacity
        style={styles.scanButton}
        onPress={openCamera}
        testID="scan-button-ventas"
      >
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

      {/* Mensaje de error */}
      {mensajeError ? (
        <View style={styles.errorContainer} testID="error-message">
          <ThemedText style={styles.errorText}>
            {mensajeError}
          </ThemedText>
        </View>
      ) : null}

      {/* Modal del escáner INTEGRADO */}
      <BarcodeScannerModalVentas
        visible={showScanner}
        onClose={closeCamera}
        onBarcodeScanned={handleBarcodeScannedWithClose}
      />
    </View>
  );
};

export default EscanearCodigoDeBarras;

const styles = StyleSheet.create({
  // Estilos de la cámara
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  overlay: {
    flex: 1,
  },
  unfocusedContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  middleContainer: {
    flexDirection: "row",
    flex: 1.5,
  },
  focusedContainer: {
    flex: 6,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  cornerTopLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    borderLeftWidth: 4,
    borderTopWidth: 4,
    borderColor: "white",
    width: 40,
    height: 40,
  },
  cornerTopRight: {
    position: "absolute",
    top: 0,
    right: 0,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderColor: "white",
    width: 40,
    height: 40,
  },
  cornerBottomLeft: {
    position: "absolute",
    bottom: 0,
    left: 0,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderColor: "white",
    width: 40,
    height: 40,
  },
  cornerBottomRight: {
    position: "absolute",
    bottom: 0,
    right: 0,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderColor: "white",
    width: 40,
    height: 40,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 5,
  },
  instructionContainer: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  instructionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 8,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  permissionText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
    lineHeight: 22,
  },
  permissionButton: {
    backgroundColor: "#4a00e0",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginBottom: 12,
  },
  permissionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#f1f1f1",
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },

  // Estilos del componente principal
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
  // Nuevos estilos para mensaje de error
  errorContainer: {
    backgroundColor: "#f8d7da",
    borderColor: "#f5c6cb",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
  },
  errorText: {
    color: "#721c24",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },
});