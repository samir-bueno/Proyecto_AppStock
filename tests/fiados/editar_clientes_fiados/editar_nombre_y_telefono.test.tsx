import FiadoScreen from "@/app/(tabs)/fiados";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import React from "react";

import * as AuthProvider from "@/contexts/AuthProvider";
import * as ApiService from "@/services/pocketbaseServices";

jest.mock("@/contexts/AuthProvider");
jest.mock("@/services/pocketbaseServices");

const mockedUseAuth = AuthProvider.useAuth as jest.Mock;
const mockedGetCustomersByOwner = ApiService.getCustomersByOwner as jest.Mock;
const mockedUpdateCustomer = ApiService.updateCustomer as jest.Mock;

describe("Editar cliente fiado - guardar cambios", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Luego de poner los nuevos datos, se presiona guardar y aparece en la lista", async () => {
    // Mock de autenticación
    mockedUseAuth.mockReturnValue({
      user: { id: "user123", name: "Test User" },
      isAuthenticated: true,
      isLoading: false,
    });

    const clienteOriginal = {
      id: "cliente123",
      name: "Maria Garcia",
      phone: "555-1234",
      deuda: "150",
      owner_id: "user123",
    };

    const clienteActualizado = {
      id: "cliente123",
      name: "Maria Gonzalez",
      phone: "999-8888",
      deuda: "150",
      owner_id: "user123",
    };

    mockedGetCustomersByOwner
      .mockResolvedValueOnce({
        success: true,
        data: [clienteOriginal],
      })
      .mockResolvedValueOnce({
        success: true,
        data: [clienteActualizado],
      });

    mockedUpdateCustomer.mockResolvedValue({
      success: true,
      data: clienteActualizado,
    });

    render(<FiadoScreen />);

    await waitFor(() => {
      expect(screen.queryByText("Cargando clientes...")).toBeNull();
    });
    await screen.findByText("Maria Garcia");

    const botonEditar = screen.getByTestId("boton-editar");
    fireEvent.press(botonEditar);

    await screen.findByText("Editar Cliente");

    const inputNombre = screen.getByDisplayValue("Maria Garcia");
    const inputTelefono = screen.getByDisplayValue("555-1234");
    fireEvent.changeText(inputNombre, "Maria Gonzalez");
    fireEvent.changeText(inputTelefono, "999-8888");

    fireEvent.press(screen.getByText("Guardar"));

    await waitFor(() => {
      expect(screen.queryByText("Cargando clientes...")).toBeNull();
    });

    await waitFor(() => {
      expect(screen.getByText("Maria Gonzalez")).toBeTruthy();
      expect(screen.getByText("999-8888")).toBeTruthy();
    });
  }, 15000);
});