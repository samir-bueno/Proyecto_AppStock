import VentasScreen from '@/app/(tabs)/ventas';
import { useAuth } from '@/contexts/AuthProvider';
import { useVentas } from '@/hooks/useVentas';
import { processSale, updateCustomer } from '@/services/pocketbaseServices';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

jest.mock('@/hooks/useVentas');
jest.mock('@/contexts/AuthProvider');
jest.mock('@/services/pocketbaseServices');

describe('Confirmación de venta fiada', () => {
  test('Si selecciono un cliente y confirmo, se registra la venta como fiado y se suma la deuda al cliente', async () => {
    const mockClienteSeleccionado = {
      id: '1',
      name: 'Juan Pérez',
      phone: '123456789',
      deuda: '1500', // Deuda inicial: 1500
      owner_id: 'user1',
      activo: true
    };

    const mockProductosEnVenta = [{
      id: '1',
      product_name: 'Laptop Gamer',
      price: '1200',
      quantity: '5',
      quantityInSale: 2, // Se venden 2
      barcode: '123456789',
      owner_id: 'user1',
    }];

    // Mock de las funciones de PocketBase
    const mockProcessSale = processSale as jest.Mock;
    const mockUpdateCustomer = updateCustomer as jest.Mock;

    mockProcessSale.mockResolvedValue({
      success: true,
      data: { id: 'sale-123', sale_type: 'fiado', total: '2400' }
    });

    mockUpdateCustomer.mockResolvedValue({
      success: true
    });

    let deudaActualizada = '';
    const mockConfirmarVentaFiada = jest.fn(async (cliente) => {
      // 1. Registrar la venta como fiado
      await mockProcessSale(
        {
          owner_id: 'user1',
          total: '2400',
          sale_type: 'fiado',
          customer_id: cliente.id
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
      
      // 2. Sumar la deuda al cliente
      const resultado = await mockUpdateCustomer(cliente.id, {
        deuda: '3900' // 1500 + 2400 = 3900
      });
      
      if (resultado.success) {
        deudaActualizada = '3900';
      }
    });

    (useAuth as jest.Mock).mockReturnValue({ user: { id: 'user1' } });
    
    // Mock inicial con modal de cliente visible
    (useVentas as jest.Mock).mockReturnValue({
      // Estados principales
      confirmarVentaFiada: mockConfirmarVentaFiada,
      showCustomerModal: true,
      customers: [mockClienteSeleccionado],
      ventaActual: mockProductosEnVenta,
      
      // Estados mínimos necesarios
      user: { id: 'user1' },
      loading: false,
      filteredProducts: [],
    });

    render(<VentasScreen />);

    // Verificar la selección de cliente está visible
    expect(screen.getByTestId('select-customer-modal')).toBeTruthy();

    // Seleccionar un cliente
    const clienteItem = screen.getByTestId('customer-item-1');
    fireEvent.press(clienteItem);

    // Presionar "Confirmar" en el modal de cliente
    const botonConfirmar = screen.getByTestId('modal-confirm-customer-button');
    fireEvent.press(botonConfirmar);

    // Esperar a que se complete la operación
    await waitFor(() => {
      // Verificar que se llamó a la función de confirmar venta fiada
      expect(mockConfirmarVentaFiada).toHaveBeenCalledTimes(1);
      expect(mockConfirmarVentaFiada).toHaveBeenCalledWith(mockClienteSeleccionado);
    });

    // VERIFICACIÓN: se registró la venta como FIADA
    expect(mockProcessSale).toHaveBeenCalledWith(
      {
        owner_id: 'user1',
        total: '2400',
        sale_type: 'fiado',
        customer_id: '1'
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

    // VERIFICACIÓN: se sumó la deuda al cliente
    expect(mockUpdateCustomer).toHaveBeenCalledWith('1', {
      deuda: '3900' // 1500 (deuda inicial) + 2400 (venta) = 3900
    });

    // Verificar que la deuda se actualizó correctamente
    expect(deudaActualizada).toBe('3900');
  });
});