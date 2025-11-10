// __tests__/hooks/useBarcodeScannerLogic.test.ts
import { useBarcodeScannerLogic } from '@/hooks/useBarcodeScannerLogic';
import { Product } from '@/services/pocketbaseServices';
import { act, renderHook } from '@testing-library/react-native';

// Mock del setTimeout
jest.useFakeTimers();

describe('useBarcodeScannerLogic', () => {
  it('muestra mensaje de advertencia y no agrega a la venta cuando no existe el producto', () => {
    const mockOnProductoEscaneado = jest.fn();
    const productosMock: Product[] = [{
      id: '1',
      barcode: '123456789',
      product_name: 'Producto Existente',
      quantity: '10',
      price: '100',
      owner_id: 'user123',
      created: '2023-01-01',
      updated: '2023-01-01'
    }];

    const { result } = renderHook(() => 
      useBarcodeScannerLogic(productosMock, mockOnProductoEscaneado)
    );

    const codigoInexistente = '9999999999999';

    // Act - Escanear código que no existe
    act(() => {
      result.current.handleBarcodeScanned(codigoInexistente);
    });

    // Assert - Verificar mensaje de advertencia
    expect(result.current.mensajeError).toBe(`No se encontró ningún producto con el código: ${codigoInexistente}`);
    
    // Assert - Verificar que NO se agregó a la venta
    expect(mockOnProductoEscaneado).not.toHaveBeenCalled();
  });
});