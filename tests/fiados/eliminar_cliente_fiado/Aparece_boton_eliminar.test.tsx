import FiadoScreen from "@/app/(tabs)/fiados";
import { render, screen } from "@testing-library/react-native";
import React from "react";

import * as AuthProvider from "@/contexts/AuthProvider";
import * as ApiService from "@/services/pocketbaseServices";
import { NavigationContainer } from "@react-navigation/native";

// --- Servicios a mockear ---
jest.mock("@/contexts/AuthProvider");
jest.mock("@/services/pocketbaseServices");

const mockedUseAuth = AuthProvider.useAuth as jest.Mock;
const mockedGetCustomersByOwner = ApiService.getCustomersByOwner as jest.Mock;

describe("Eliminar cliente fiado - boton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Debe haber un botón para 'eliminar' el cliente fiado", async () => {
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
    
    render(<FiadoScreen />, {
      wrapper: NavigationContainer
    });

    expect(await screen.findByText("Juan Perez"));

    const botonEliminar = screen.getByTestId("boton-eliminar");
    expect(botonEliminar).toBeTruthy();
  }, 10000);
});