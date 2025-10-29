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
const mockedDeleteCustomer = ApiService.deleteCustomer as jest.Mock;

describe("Eliminar cliente fiado - marcado como inactivo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Un cliente no es eliminado de la base de datos, sino, puesto como inactivo", async () => {
    mockedUseAuth.mockReturnValue({
      user: { id: "user123", name: "Test User" },
      isAuthenticated: true,
      isLoading: false,
    });

    const clienteOriginal = {
      id: "cliente123",
      name: "Juan Perez",
      phone: "123456789",
      deuda: "100",
      owner_id: "user123",
      activo: true
    };

    mockedGetCustomersByOwner.mockResolvedValueOnce({
      success: true,
      data: [clienteOriginal],
    });

    mockedGetCustomersByOwner.mockResolvedValueOnce({
      success: true,
      data: [], 
    });

    let capturedUpdateData: any = null;
    mockedDeleteCustomer.mockImplementation(async () => {
      capturedUpdateData = { activo: false };
      return {
        success: true,
        data: { ...clienteOriginal, activo: false }
      };
    });

    render(<FiadoScreen />);

    await screen.findByText("Juan Perez");

    const botonEliminar = screen.getByTestId("boton-eliminar");
    fireEvent.press(botonEliminar);

    await waitFor(() => {
      expect(screen.getByText("Marcar como Inactivo")).toBeTruthy();
    });
    
    fireEvent.press(screen.getByText("Marcar como Inactivo"));

    await waitFor(() => {
      expect(mockedDeleteCustomer).toHaveBeenCalledWith("cliente123");
    });

    await waitFor(() => {
      expect(screen.queryByText("Juan Perez")).toBeNull();
    });
  }, 15000);
});