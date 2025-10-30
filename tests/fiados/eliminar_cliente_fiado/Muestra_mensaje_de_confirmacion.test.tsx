import FiadoScreen from "@/app/(tabs)/fiados";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import React from "react";

import * as AuthProvider from "@/contexts/AuthProvider";
import * as ApiService from "@/services/pocketbaseServices";

// --- Servicios a mockear ---
jest.mock("@/contexts/AuthProvider");
jest.mock("@/services/pocketbaseServices");

const mockedUseAuth = AuthProvider.useAuth as jest.Mock;
const mockedGetCustomersByOwner = ApiService.getCustomersByOwner as jest.Mock;

describe("Eliminar cliente fiado - confirmación", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Al eliminar un cliente fiado, debe pedirse una confirmación antes de borrarlo definitivamente", async () => {
    mockedUseAuth.mockReturnValue({
      user: { id: "user123", name: "Test User" },
      isAuthenticated: true,
      isLoading: false,
    });

    mockedGetCustomersByOwner.mockResolvedValue({
      success: true,
      data: [
        {
          id: "cliente123",
          name: "Juan Perez",
          phone: "123456789",
          deuda: "100",
          owner_id: "user123",
        }
      ],
    });

    render(<FiadoScreen />);

    await screen.findByText("Juan Perez");

    const botonEliminar = screen.getByTestId("boton-eliminar");
    fireEvent.press(botonEliminar);

    await waitFor(() => {
      expect(screen.getByText("¿Marcar cliente como inactivo?")).toBeTruthy();
    });

    expect(screen.getByText("El cliente será marcado como inactivo y ya no aparecerá en la lista principal.")).toBeTruthy();

    expect(screen.getByText("Cancelar")).toBeTruthy();
    expect(screen.getByText("Confirmar")).toBeTruthy();

  }, 10000);
});