import VentasScreen from '@/app/(tabs)/ventas';
import { useAuth } from '@/contexts/AuthProvider';
import { useVentas } from '@/hooks/useVentas';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

jest.mock('@/hooks/useVentas');
jest.mock('@/contexts/AuthProvider');

describe('Modal de selección de cliente para venta fiada', () => {
  test('Al presionar "Venta fiado", se debe mostrar una lista de clientes fiados existentes con su deuda visible', async () => {
    const mockClientesFiados = [
      {
        id: '1',
        name: 'Juan Pérez',
        phone: '123456789',
        deuda: '1500',
        owner_id: 'user1',
        activo: true
      },
      {
        id: '2', 
        name: 'María García',
        phone: '987654321',
        deuda: '800',
        owner_id: 'user1',
        activo: true
      }
    ];

    let showCustomerModal = false;
    const mockHandleVentaFiado = jest.fn(() => {
      showCustomerModal = true;
    });

    (useAuth as jest.Mock).mockReturnValue({ user: { id: 'user1' } });
    
    // Mock inicial
    (useVentas as jest.Mock).mockReturnValue({
      // Estados principales
      ventaActual: [{ id: '1', product_name: 'Laptop', price: '1200', quantityInSale: 1 }],
      handleVentaFiado: mockHandleVentaFiado,
      showCustomerModal: showCustomerModal,
      customers: mockClientesFiados,
      filteredProducts: [],
      
      // Estados mínimos necesarios
      user: { id: 'user1' },
      loading: false,
      showConfirmModal: false,
      busqueda: '',
      isSearchFocused: false,
    });

    const { rerender } = render(<VentasScreen />);

    // Presionar "Venta fiado"
    const botonVentaFiado = screen.getByTestId('venta-fiado-button');
    fireEvent.press(botonVentaFiado);

    // Actualizar el mock después de presionar el botón
    (useVentas as jest.Mock).mockReturnValue({
      // Estados principales
      ventaActual: [{ id: '1', product_name: 'Laptop', price: '1200', quantityInSale: 1 }],
      handleVentaFiado: mockHandleVentaFiado,
      showCustomerModal: true,
      customers: mockClientesFiados,
      filteredProducts: [],
    });

    rerender(<VentasScreen />);

    await waitFor(() => {
      // Verificar que se muestra la selección de cliente
      expect(screen.getByTestId('select-customer-modal')).toBeTruthy();
      expect(screen.getByText('Seleccionar Cliente Fiado')).toBeTruthy();
      
      // Verificar que se muestran los clientes fiados con sus nombres
      expect(screen.getByText('Juan Pérez')).toBeTruthy();
      expect(screen.getByText('María García')).toBeTruthy();
      
      // Verificar que la deuda de cada cliente es visible
      expect(screen.getByText('Deuda Actual: $1500.00')).toBeTruthy();
      expect(screen.getByText('Deuda Actual: $800.00')).toBeTruthy();
      
      // Verificar que se muestran los botones
      expect(screen.getByTestId('modal-confirm-customer-button')).toBeTruthy();
      expect(screen.getByTestId('modal-cancel-customer-button')).toBeTruthy();
      
      // Verificar que los items de cliente existen
      expect(screen.getByTestId('customer-item-1')).toBeTruthy();
      expect(screen.getByTestId('customer-item-2')).toBeTruthy();
    });
  });
});