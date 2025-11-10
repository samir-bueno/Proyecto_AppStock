// hooks/useBarcodeScannerLogic.ts
import { Product } from '@/services/pocketbaseServices';
import { useState } from 'react';

export interface BarcodeScannerLogicReturn {
  mensajeError: string;
  handleBarcodeScanned: (barcode: string) => { success: boolean; producto?: Product; error?: string };
  clearError: () => void;
  ultimoCodigoEscaneado: string;
}

export const useBarcodeScannerLogic = (
  productos: Product[], 
  onProductoEscaneado: (producto: Product) => void
): BarcodeScannerLogicReturn => {
  const [mensajeError, setMensajeError] = useState<string>("");
  const [ultimoCodigoEscaneado, setUltimoCodigoEscaneado] = useState<string>("");

  const handleBarcodeScanned = (barcode: string) => {
    setUltimoCodigoEscaneado(barcode);
    
    // Buscar el producto por código de barras
    const productoEncontrado = productos.find(producto => producto.barcode === barcode);

    if (productoEncontrado) {
      if (Number(productoEncontrado.quantity) > 0) {
        // Si tiene stock, agregar a la venta
        onProductoEscaneado(productoEncontrado);
        setMensajeError("");
        return { success: true, producto: productoEncontrado };
      } else {
        // Si no tiene stock, mostrar advertencia
        const errorMsg = `El producto "${productoEncontrado.product_name}" no tiene stock disponible.`;
        setMensajeError(errorMsg);
        setTimeout(() => setMensajeError(""), 2000);
        return { success: false, error: errorMsg };
      }
    } else {
      // Si no se encuentra el producto, mostrar advertencia
      const errorMsg = `No se encontró ningún producto con el código: ${barcode}`;
      setMensajeError(errorMsg);
      setTimeout(() => setMensajeError(""), 2000);
      return { success: false, error: errorMsg };
    }
  };

  const clearError = () => setMensajeError("");

  return { 
    mensajeError, 
    handleBarcodeScanned,
    clearError,
    ultimoCodigoEscaneado
  };
};