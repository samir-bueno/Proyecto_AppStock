import FiadoScreen from "@/app/(tabs)/fiados";
import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";

import * as AuthProvider from "@/contexts/AuthProvider";
import * as ApiService from "@/services/pocketbaseServices";

// --- Servicios a mockear ---
jest.mock("@/contexts/AuthProvider");
jest.mock("@/services/pocketbaseServices");

const mockedUseAuth = AuthProvider.useAuth as jest.Mock;
const mockedGetCustomersByOwner = ApiService.getCustomersByOwner as jest.Mock;

describe("Editar cliente fiado - formulario", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("El formulario se abre y muestra el nombre y telefono del cliente", async () => {
    mockedUseAuth.mockReturnValue({
      user: { id: "user123", name: "Test User" },
      isAuthenticated: true,
      isLoading: false,
    });

    const clientePrueba = {
      id: "cliente123",
      name: "Maria Garcia",
      phone: "555-1234",
      deuda: "150",
      owner_id: "user123",
    };

    mockedGetCustomersByOwner.mockResolvedValue({
      success: true,
      data: [clientePrueba],
    });

    render(<FiadoScreen />);

    await screen.findByText("Maria Garcia");

    const botonEditar = screen.getByTestId("boton-editar");
    fireEvent.press(botonEditar);

    expect(await screen.findByText("Editar Cliente"));

    expect(screen.getByDisplayValue("Maria Garcia")).toBeTruthy();
    expect(screen.getByDisplayValue("555-1234")).toBeTruthy();
  }, 10000);
});