// tests/prueba.test.tsx

import FiadoScreen from '@/app/(tabs)/fiados';
import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';

import * as AuthProvider from '@/contexts/AuthProvider';
import * as ApiService from '@/services/pocketbaseServices';

// --- Servicios a mockear ---
jest.mock('@/contexts/AuthProvider');
jest.mock('@/services/pocketbaseServices');

const mockedUseAuth = AuthProvider.useAuth as jest.Mock;
const mockedGetCustomersByOwner = ApiService.getCustomersByOwner as jest.Mock;
const mockedCreateCustomer = ApiService.createCustomer as jest.Mock;

describe('FiadosScreen: Registrar nuevo cliente', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('El cliente recién agregado debe mostrarse con su nombre y teléfono', async () => {
    // --- Configuración de mocks ---
    mockedUseAuth.mockReturnValue({
      user: { id: 'user123', name: 'Test User' },
      isAuthenticated: true,
      isLoading: false,
    });

    mockedGetCustomersByOwner.mockResolvedValue({
      success: true,
      data: [], // La lista empieza vacía
    });

    const nuevoCliente = {
      id: 'cliente456',
      name: 'Juan Perez',
      deuda: '0',
      owner_id: 'user123',
    };
    mockedCreateCustomer.mockResolvedValue({
      success: true,
      data: nuevoCliente,
    });

    render(<FiadoScreen />);

    const addButton = await screen.findByText('Agregar Cliente Fiado');
    fireEvent.press(addButton);
    
    
    // Esperamos a que el modal aparezca
    const modalTitle = await screen.findByText('Agregar Nuevo Cliente');
    expect(modalTitle).toBeTruthy();

    // Se crea un nuevo cliente
    const inputNombre = screen.getByPlaceholderText('Nombre del cliente *');
    fireEvent.changeText(inputNombre, 'Juan Perez');

    // El usuario presiona el botón para confirmar y guardar
    fireEvent.press(screen.getByText('Guardar'));
    
    // Simulamos que se guarda el cliente en una lista (como si fuera la de pocketbase)
    mockedGetCustomersByOwner.mockResolvedValue({
        success: true,
        data: [nuevoCliente],
    });

    expect(await screen.findByText('Juan Perez')).toBeTruthy();
    
    // Usamos getAllByText si el "$0" pudiera aparecer en otros lugares, 
    // tambien se puede usar testId para ser especificos
    expect(screen.getByText('Juan Perez')).toBeTruthy(); 
    expect(screen.getByText('Sin teléfono')).toBeTruthy(); 
    expect(screen.getByText('$0')).toBeTruthy(); 

  });
});