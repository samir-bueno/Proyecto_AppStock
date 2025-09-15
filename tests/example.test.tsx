// FiadoScreen.test.tsx
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import FiadoScreen from '../app/(tabs)/fiados';

// Mock mínimo esencial
jest.mock('../contexts/AuthProvider', () => ({
  useAuth: () => ({
    user: { id: 'user123', name: 'Test User' }
  })
}));

// Mock mínimo de los servicios
jest.mock('../services/pocketBaseService', () => ({
  getCustomersByOwner: jest.fn(() => Promise.resolve({ 
    success: true, 
    data: [] 
  })),
  createCustomer: jest.fn(() => Promise.resolve({ success: true }))
}));

// Mock para MaterialCommunityIcons
jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: () => null
}));

describe('<FiadoScreen /> - Smoke Test', () => {
  test('El componente se renderiza sin errores', () => {
    expect(() => {
      render(<FiadoScreen />);
    }).not.toThrow();
  });

  test('Muestra el estado de carga inicial', () => {
    const { getByText } = render(<FiadoScreen />);
    expect(getByText('Cargando clientes...')).toBeTruthy();
  });

  test('Al tocar el botón "Agregar cliente fiado", se despliega el formulario', async () => {
    render(<FiadoScreen />);
    
    // ESPERAR A QUE TERMINE LA CARGA - Esto es crucial
    await waitFor(() => {
      expect(screen.queryByText('Cargando clientes...')).toBeNull();
    }, { timeout: 3000 });
    
    // Ahora buscar el botón por accessibilityLabel
    const addButton = screen.getByLabelText('Agregar Cliente Fiado');
    
    // Verificar que inicialmente el formulario NO está visible
    expect(screen.queryByText('Agregar Nuevo Cliente')).toBeNull();
    expect(screen.queryByPlaceholderText('Nombre del cliente *')).toBeNull();
    expect(screen.queryByPlaceholderText('Teléfono (opcional)')).toBeNull();
    
    // Presionar el botón
    fireEvent.press(addButton);
    
    // Verificar que el formulario ahora es visible
    expect(screen.getByText('Agregar Nuevo Cliente')).toBeTruthy();
    expect(screen.getByPlaceholderText('Nombre del cliente *')).toBeTruthy();
    expect(screen.getByPlaceholderText('Teléfono (opcional)')).toBeTruthy();
  });
});