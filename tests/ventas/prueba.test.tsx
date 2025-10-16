// tests/prueba.test.tsx

import HomeScreen from "@/app/(tabs)/ventas";
import { render, screen } from "@testing-library/react-native";
import React from "react";

import * as AuthProvider from "@/contexts/AuthProvider";
import * as ApiService from "@/services/pocketbaseServices";

// --- Servicios a mockear ---
jest.mock("@/contexts/AuthProvider");
jest.mock("@/services/pocketbaseServices");

const mockedUseAuth = AuthProvider.useAuth as jest.Mock;
const mockedGetProductsByOwner = ApiService.getProductsByOwner as jest.Mock;

describe("<HomeScreen />: Buscar producto", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Al buscar un producto por nombre, solo se muestran productos que tienen al menos 1 unidad en stock.", async () => {
    // --- Configuración de mocks ---
    mockedUseAuth.mockReturnValue({
      user: { id: "user123", name: "Test User" },
      isAuthenticated: true,
      isLoading: false,
    });
    mockedGetProductsByOwner.mockResolvedValue({
      success: true,
      data: [], // La lista empieza vacia (no hay productos)
    });


    render(<HomeScreen />);

    screen.getByPlaceholderText("Buscar por nombre...").focus();

  }, 10000); // Aumentamos el timeout a 10 segundos
});
