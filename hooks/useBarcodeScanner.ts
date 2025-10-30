import { useCameraPermissions } from 'expo-camera';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

export const useBarcodeScanner = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  // Solicitar permisos de cámara
  useEffect(() => {
    if (permission && !permission.granted && !permission.canAskAgain) {
      Alert.alert(
        'Permiso denegado',
        'Se necesita acceso a la cámara para escanear códigos de barras. Por favor, habilita los permisos de cámara en la configuración de tu dispositivo.'
      );
    }
  }, [permission]);

  const handleBarcodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    return data;
  };

  const resetScanner = () => {
    setScanned(false);
  };

  return {
    hasPermission: permission?.granted || false,
    permission,
    requestPermission,
    scanned,
    handleBarcodeScanned,
    resetScanner,
  };
};