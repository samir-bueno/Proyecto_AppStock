import VentasScreen from '@/app/(tabs)/ventas';
import { useAuth } from '@/contexts/AuthProvider';
import { useVentas } from '@/hooks/useVentas';
import { fireEvent, render, screen } from '@testing-library/react-native';

jest.mock('@/hooks/useVentas');
jest.mock('@/contexts/AuthProvider');

describe('Modal de confirmación de venta', () => {
  test('Al presionar "Venta normal", debe mostrarse un resumen con el total y los botones "Confirmar" y "Cancelar"', () => {
    const mockProductosEnVenta = [{
      id: '1',
      product_name: 'Laptop Gamer',
      price: '1200',
      quantity: '5',
      quantityInSale: 2,
      barcode: '123456789',
      owner_id: 'user1',
    }];

    let showConfirmModal = false;
    const mockHandleVentaNormal = jest.fn(() => {
      showConfirmModal = true;
    });

    (useAuth as jest.Mock).mockReturnValue({ user: { id: 'user1' } });
    
    // Mock inicial
    (useVentas as jest.Mock).mockReturnValue({
      ventaActual: mockProductosEnVenta,
      handleVentaNormal: mockHandleVentaNormal,
      filteredProducts: [],
      agregarProductoAVenta: jest.fn(),
      showConfirmModal: showConfirmModal,
    });

    const { rerender } = render(<VentasScreen />);

    // Presionar "Venta normal"
    const botonVentaNormal = screen.getByTestId('venta-normal-button');
    fireEvent.press(botonVentaNormal);

    // Actualizar el mock después de presionar el botón
    (useVentas as jest.Mock).mockReturnValue({
      ventaActual: mockProductosEnVenta,
      handleVentaNormal: mockHandleVentaNormal,
      filteredProducts: [],
      agregarProductoAVenta: jest.fn(),
      showConfirmModal: true,
    });

    rerender(<VentasScreen />);

    // Verificar que se muestra el modal con el resumen
    expect(screen.getByTestId('confirm-sale-modal')).toBeTruthy();
    expect(screen.getByTestId('modal-title')).toHaveTextContent('Resumen de Venta');
    
    // Verificar que se muestra el producto en el resumen
    expect(screen.getByTestId('modal-product-name-1')).toHaveTextContent('Laptop Gamer');
    
    // Verificar que se muestra el total
    expect(screen.getByTestId('modal-total')).toHaveTextContent('Total: $2400.00');
    
    // Verificar que se muestran los botones "Confirmar" y "Cancelar"
    expect(screen.getByTestId('modal-confirm-button')).toHaveTextContent('Confirmar');
    expect(screen.getByTestId('modal-cancel-button')).toHaveTextContent('Cancelar');
  });
});