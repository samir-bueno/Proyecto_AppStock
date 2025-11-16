// resumen.test.tsx
import Resumen from '@/app/(tabs)/resumen'; // Ajusta la ruta si es necesario
import { NavigationContainer } from '@react-navigation/native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useFocusEffect: (callback: () => void) => callback(), // Ejecutar el efecto inmediatamente
}));

const mockUser = { id: 'testUserId', name: 'Test User' };
jest.mock('@/contexts/AuthProvider', () => ({
  useAuth: () => ({
    user: mockUser,
  }),
}));

jest.mock('@/services/pocketbaseServices', () => ({
  getTotalCustomerDebt: jest.fn(() =>
    Promise.resolve({ success: true, data: 3000 })
  ),
  getTotalGain: jest.fn(() =>
    Promise.resolve({ success: true, data: 20000 })
  ),
  getProductsDisponibleByOwner: jest.fn(() =>
    Promise.resolve({ success: true, data: [] })
  ),
  getProductsPorAgotarse: jest.fn(() =>
    Promise.resolve({ success: true, data: [] })
  ),
}));


describe('Resumen', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  test('Al tocar "$ Deuda de los clientes”, se abre una vista con la lista de clientes fiados con deuda pendiente.', async () => {
    const { getByText, getByTestId } = render(<Resumen />, { wrapper: NavigationContainer });

    await waitFor(() => {

      expect(getByTestId('Valor-deuda-clientes')).toHaveTextContent(`$3000`);
    });

    const clientDebtLabel = getByText('Deuda de clientes');

    fireEvent.press(clientDebtLabel);

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/(resumen)/clientes_deuda');
  });
});