import VentasScreen from '@/app/(tabs)/ventas';
import { useAuth } from '@/contexts/AuthProvider';
import { useVentas } from '@/hooks/useVentas';
import { fireEvent, render, screen } from '@testing-library/react-native';

jest.mock('@/hooks/useVentas');
jest.mock('@/contexts/AuthProvider');
jest.mock('@/components/global/header', () => 'Header');

describe('Bloqueo de venta mayor al stock', () => {
  test('Si se intenta vender una cantidad mayor al stock disponible, se bloquea esa acción', () => {
    let ventaActual = [{
      id: '1',
      product_name: 'Laptop',
      price: '1200',
      quantity: '2',
      quantityInSale: 2,
      barcode: '123456',
      owner_id: 'user1',
    }];

    const mockHandleQuantityChange = jest.fn((productId, change) => {
      ventaActual = ventaActual.map(p => 
        p.id === productId 
          ? { 
              ...p, 
              quantityInSale: Math.min(p.quantityInSale + change, Number(p.quantity))
            }
          : p
      );
    });

    (useAuth as jest.Mock).mockReturnValue({ user: { id: 'user1' } });
    (useVentas as jest.Mock).mockReturnValue({
      ventaActual,
      handleQuantityChange: mockHandleQuantityChange,
      busqueda: '',
      loading: false,
      filteredProducts: [],
      isSearchFocused: false,
      agregarProductoAVenta: jest.fn(),
      setbusqueda: jest.fn(),
      setIsSearchFocused: jest.fn(),
    });

    render(<VentasScreen />);

    // VERIFICACIÓN INICIAL
    expect(screen.getByText('Laptop')).toBeTruthy();
    expect(screen.getByText('2')).toBeTruthy(); 
    expect(screen.getByText(/\$.*1200/)).toBeTruthy();
    expect(screen.getByText('$2400')).toBeTruthy();

    // Intentar vender 1 más, sería 3, pero stock es 2
    const botonMas = screen.getByText('+');
    fireEvent.press(botonMas);

    // Se llamó a la función de manejo de cantidad
    expect(mockHandleQuantityChange).toHaveBeenCalledWith('1', 1);

    fireEvent.press(botonMas);
    fireEvent.press(botonMas);
    fireEvent.press(botonMas);

    
    // La cantidad en el estado se mantuvo en 2
    expect(ventaActual[0].quantityInSale).toBe(2);
    
    // La UI sigue mostrando 2
    expect(screen.getByText('2')).toBeTruthy();
    
    // No aparece un 3 en ningún lugar 
    expect(screen.queryByText('3')).toBeNull();
  });
});