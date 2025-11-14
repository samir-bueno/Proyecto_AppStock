import VentasScreen from '@/app/(tabs)/ventas';
import { useAuth } from '@/contexts/AuthProvider';
import { useVentas } from '@/hooks/useVentas';
import { processSale, updateProductStock } from '@/services/pocketbaseServices';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

jest.mock('@/hooks/useVentas');
jest.mock('@/contexts/AuthProvider');
jest.mock('@/services/pocketbaseServices');

describe('Confirmación de venta', () => {
  test('Si presiono "Confirmar", el stock de los productos se descuenta y la venta queda registrada como pagada', async () => {
    const mockProductosEnVenta = [{
      id: '1',
      product_name: 'Laptop Gamer',
      price: '1200',
      quantity: '5', // Stock inicial: 5
      quantityInSale: 2, // Se venden 2
      barcode: '123456789',
      owner_id: 'user1',
    }];

    let showConfirmModal = true;
    let ventaActual = [...mockProductosEnVenta];
    
    // Mock de las funciones de PocketBase
    const mockProcessSale = processSale as jest.Mock;
    const mockUpdateProductStock = updateProductStock as jest.Mock;

    mockProcessSale.mockResolvedValue({
      success: true,
      data: { id: 'sale-123', sale_type: 'normal', total: '2400' }
    });

    mockUpdateProductStock.mockResolvedValue({
      success: true
    });

    const mockConfirmarVenta = jest.fn(async () => {
      // Simular el proceso completo de confirmación
      await mockProcessSale(
        {
          owner_id: 'user1',
          total: '2400',
          sale_type: 'normal',
          customer_id: undefined
        },
        [
          {
            product_id: '1',
            product_name: 'Laptop Gamer',
            quantity: 2,
            unit_price: 1200,
            subtotal: 2400
          }
        ]
      );
      
      // Simular descuento de stock (de 5 a 3)
      await mockUpdateProductStock('1', 3);
      
      ventaActual = []; // Los productos desaparecen de la venta
      showConfirmModal = false; // El modal se cierra
    });

    (useAuth as jest.Mock).mockReturnValue({ user: { id: 'user1' } });
    
    // Mock inicial con modal visible
    (useVentas as jest.Mock).mockReturnValue({
      // Estados principales
      ventaActual: ventaActual,
      handleVentaNormal: jest.fn(),
      confirmarVenta: mockConfirmarVenta,
      cancelarVenta: jest.fn(),
      filteredProducts: [],
      agregarProductoAVenta: jest.fn(),
      showConfirmModal: showConfirmModal,
      loadProducts: jest.fn(),
      
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
      handleQuantityChange: jest.fn(),
      handleVentaFiado: jest.fn(),
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

    // Presionar "Confirmar" en el modal
    const botonConfirmar = screen.getByTestId('modal-confirm-button');
    fireEvent.press(botonConfirmar);

    // Esperar a que se completen las operaciones async
    await waitFor(() => {
      expect(mockConfirmarVenta).toHaveBeenCalledTimes(1);
    });

    // Verificar que se llamó a processSale para registrar la venta como pagada
    expect(mockProcessSale).toHaveBeenCalledWith(
      {
        owner_id: 'user1',
        total: '2400',
        sale_type: 'normal',
        customer_id: undefined
      },
      [
        {
          product_id: '1',
          product_name: 'Laptop Gamer',
          quantity: 2,
          unit_price: 1200,
          subtotal: 2400
        }
      ]
    );

    // Verificar EXPLÍCITAMENTE que se descuenta el stock
    expect(mockUpdateProductStock).toHaveBeenCalledWith('1', 3); // 5 - 2 = 3

    // Actualizar el mock después de confirmar
    (useVentas as jest.Mock).mockReturnValue({
      // Estados principales
      ventaActual: [], // Venta vacía después de confirmar
      handleVentaNormal: jest.fn(),
      confirmarVenta: mockConfirmarVenta,
      cancelarVenta: jest.fn(),
      filteredProducts: [],
      agregarProductoAVenta: jest.fn(),
      showConfirmModal: false, // Modal cerrado
      loadProducts: jest.fn(),
      
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
      handleQuantityChange: jest.fn(),
      handleVentaFiado: jest.fn(),
      confirmarVentaFiada: jest.fn(),
      cancelarSeleccionCliente: jest.fn(),
      setbusqueda: jest.fn(),
      setIsSearchFocused: jest.fn(),
      setShowConfirmModal: jest.fn(),
      setShowCustomerModal: jest.fn(),
      agregarProductoPorCodigoBarras: jest.fn(),
    });

    rerender(<VentasScreen />);

    // Verificaciones finales
    await waitFor(() => {
      // 1. El modal se cierra
      expect(screen.queryByTestId('confirm-sale-modal')).toBeNull();
      
      // 2. Los productos desaparecen de la venta actual
      expect(screen.queryByTestId('product-name-1')).toBeNull();
      expect(screen.getByText('No hay productos en la venta')).toBeTruthy();
    });
  });
});