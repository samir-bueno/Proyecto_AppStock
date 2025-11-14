import VentasScreen from '@/app/(tabs)/ventas';
import { useAuth } from '@/contexts/AuthProvider';
import { useVentas } from '@/hooks/useVentas';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

jest.mock('@/hooks/useVentas');
jest.mock('@/contexts/AuthProvider');

describe('Cancelación de venta', () => {
  test('Si presiono "Cancelar", la acción se anula y vuelvo a la pantalla anterior', async () => {
    let showConfirmModal = true;
    const mockCancelarVenta = jest.fn(() => {
      showConfirmModal = false; // Actualizar el estado al cancelar
    });
    
    (useAuth as jest.Mock).mockReturnValue({ user: { id: 'user1' } });
    
    // Mock INICIAL - modal visible
    (useVentas as jest.Mock).mockReturnValue({
      // Estados principales
      ventaActual: [{ id: '1', product_name: 'Laptop', price: '1200', quantityInSale: 2 }],
      cancelarVenta: mockCancelarVenta,
      showConfirmModal: showConfirmModal,
      filteredProducts: [],
      
      // Estados necesarios para evitar errores
      user: { id: 'user1' },
      loading: false,
      busqueda: '',
      isSearchFocused: false,
      showCustomerModal: false,
      customers: [],
      selectedCustomer: null,
      products: [],
      
      // Funciones necesarias para evitar errores
      agregarProductoAVenta: jest.fn(),
      handleQuantityChange: jest.fn(),
      handleVentaNormal: jest.fn(),
      handleVentaFiado: jest.fn(),
      confirmarVenta: jest.fn(),
      confirmarVentaFiada: jest.fn(),
      cancelarSeleccionCliente: jest.fn(),
      setbusqueda: jest.fn(),
      setIsSearchFocused: jest.fn(),
      setShowConfirmModal: jest.fn(),
      setShowCustomerModal: jest.fn(),
      agregarProductoPorCodigoBarras: jest.fn(),
    });

    const { rerender } = render(<VentasScreen />);

    // Verificar que el modal está visible inicialmente
    expect(screen.getByTestId('confirm-sale-modal')).toBeTruthy();

    // Presionar "Cancelar"
    fireEvent.press(screen.getByTestId('modal-cancel-button'));

    // Mock ACTUALIZADO - modal cerrado
    (useVentas as jest.Mock).mockReturnValue({
      // Estados principales
      ventaActual: [{ id: '1', product_name: 'Laptop', price: '1200', quantityInSale: 2 }],
      cancelarVenta: mockCancelarVenta,
      showConfirmModal: false, // ← Modal cerrado
      filteredProducts: [],
      
      // Estados necesarios para evitar errores
      user: { id: 'user1' },
      loading: false,
      busqueda: '',
      isSearchFocused: false,
      showCustomerModal: false,
      customers: [],
      selectedCustomer: null,
      products: [],
      
      // Funciones necesarias para evitar errores
      agregarProductoAVenta: jest.fn(),
      handleQuantityChange: jest.fn(),
      handleVentaNormal: jest.fn(),
      handleVentaFiado: jest.fn(),
      confirmarVenta: jest.fn(),
      confirmarVentaFiada: jest.fn(),
      cancelarSeleccionCliente: jest.fn(),
      setbusqueda: jest.fn(),
      setIsSearchFocused: jest.fn(),
      setShowConfirmModal: jest.fn(),
      setShowCustomerModal: jest.fn(),
      agregarProductoPorCodigoBarras: jest.fn(),
    });

    rerender(<VentasScreen />);

    await waitFor(() => {
      // Verificar que se canceló la venta
      expect(mockCancelarVenta).toHaveBeenCalledTimes(1);
      
      // Verificar que el modal se cierra (vuelvo a pantalla anterior)
      expect(screen.queryByTestId('confirm-sale-modal')).toBeNull();
      
      // Verificar que los productos SIGUEN en la venta (acción anulada)
      expect(screen.getByTestId('product-name-1')).toBeTruthy();
    });
  });
});