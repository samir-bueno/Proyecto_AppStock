import Header from "@/components/global/header";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import React from 'react';

// 1. MOCK LOCAL DE useAuth
// Creamos una función espía de Jest para 'logout'
const mockLogout = jest.fn();

// Mockeamos el módulo completo de AuthProvider.
// Esto sobrescribe el comportamiento de useAuth para todos los tests en este archivo.
jest.mock('@/contexts/AuthProvider', () => ({
    // El mock para useAuth simula el estado inicial (autenticado) y proporciona el espía.
    useAuth: () => ({
        isAuthenticated: true, // Debe ser 'true' para que el Header se renderice
        isLoading: false,
        user: { id: 'test-id', name: 'Usuario de Prueba' },
        logout: mockLogout, // Usamos el espía
    }),
    // El AuthProvider en sí mismo solo necesita renderizar a sus hijos en el mock
    AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// 2. MOCK ADICIONAL PARA expo-router
// Es necesario para que los componentes del router no fallen al renderizarse
jest.mock('expo-router', () => ({
    ...jest.requireActual('expo-router'),
    Redirect: () => null,
    Stack: {
        Screen: () => null,
    },
}));


describe('Header Component - Cierre de Sesión', () => {
    beforeEach(() => {
        // Limpiamos la función espía antes de cada prueba para resetear el contador de llamadas.
        mockLogout.mockClear();
    });

    test("Después de confirmar el cierre de sesión, se llama a la función de logout, lo que provoca la redirección.", async () => {
        // Arrange: Renderizamos Header. Ya que el hook está mockeado, no necesitamos el wrapper.
        // Usamos el wrapper si necesitáramos el contexto real.
        render(<Header />);

        // Paso 1: Disparamos la apertura del modal (presionar el ícono de logout)
        fireEvent.press(screen.getByTestId("logout"));

        // Paso 2: Esperamos a que el modal de confirmación aparezca
        await waitFor(() => {
            expect(screen.getByText("¿Cerrar sesión?")).toBeTruthy();
            expect(screen.getByText("Estás a punto de cerrar sesión, ¿estás seguro?")).toBeTruthy();
            expect(screen.getByText("Confirmar")).toBeTruthy();
        });

        // Paso 3: Disparamos el clic en el botón de confirmación
        const confirmButton = screen.getByText("Confirmar");
        fireEvent.press(confirmButton);

        // Paso 4: ¡Aserción clave! Verificamos que la función 'logout' fue llamada.
        // En tu aplicación real, esta llamada cambia 'isAuthenticated' a false, lo que
        // desencadena la redirección declarativa en tu layout.
        expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    test("El cierre de sesión se cancela correctamente y NO se llama a logout.", async () => {
        render(<Header />);

        // 1. Abrir el modal
        fireEvent.press(screen.getByTestId("logout"));

        // 2. Esperar a que el modal aparezca
        await waitFor(() => {
            expect(screen.getByText("Cancelar")).toBeTruthy();
        });

        // 3. Clic en Cancelar
        fireEvent.press(screen.getByText("Cancelar"));

        // 4. Aserción: El modal se cerró
        await waitFor(() => {
            expect(screen.queryByText("¿Cerrar sesión?")).toBeNull();
        });

        // 5. Aserción: La función de logout NO fue llamada
        expect(mockLogout).not.toHaveBeenCalled();
    });
});
