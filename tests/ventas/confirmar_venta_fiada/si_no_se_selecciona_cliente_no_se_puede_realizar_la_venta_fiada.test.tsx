import VentasScreen from '@/app/(tabs)/ventas';
import { useAuth } from '@/contexts/AuthProvider';
import { useVentas } from '@/hooks/useVentas';
import { fireEvent, render, screen } from '@testing-library/react-native';

jest.mock('@/hooks/useVentas');
jest.mock('@/contexts/AuthProvider');

describe('Validación de selección de cliente para venta fiada', () => {
  test('Si no se selecciona cliente, no puede confirmarse la venta fiada', () => {
    const mockClientesFiados = [
      {
        id: '1',
        name: 'Juan Pérez',
        phone: '123456789',
        deuda: '1500',
        owner_id: 'user1',
        activo: true
      }
    ];

    const mockConfirmarVentaFiada = jest.fn();

    (useAuth as jest.Mock).mockReturnValue({ user: { id: 'user1' } });
    
    (useVentas as jest.Mock).mockReturnValue({
      // Estados principales
      confirmarVentaFiada: mockConfirmarVentaFiada,
      showCustomerModal: true,
      customers: mockClientesFiados,
      
      // Estados mínimos necesarios
      user: { id: 'user1' },
      loading: false,
      ventaActual: [{ id: '1', product_name: 'Laptop', price: '1200', quantityInSale: 2 }],
      filteredProducts: [],
    });

    render(<VentasScreen />);

    // Verificar que el modal de selección de cliente está visible
    expect(screen.getByTestId('select-customer-modal')).toBeTruthy();

    // El botón de confirmar debe estar DESHABILITADO
    const botonConfirmar = screen.getByTestId('modal-confirm-customer-button');
    expect(botonConfirmar).toBeDisabled();

    // El botón debe tener el texto "Selecciona Cliente"
    expect(botonConfirmar).toHaveTextContent('Selecciona Cliente');

    // Intentar presionar el botón deshabilitado NO debe llamar a la función
    fireEvent.press(botonConfirmar);
    expect(mockConfirmarVentaFiada).not.toHaveBeenCalled();

    // El botón cancelar SÍ está habilitado
    const botonCancelar = screen.getByTestId('modal-cancel-customer-button');
    expect(botonCancelar).not.toBeDisabled();
  });
});