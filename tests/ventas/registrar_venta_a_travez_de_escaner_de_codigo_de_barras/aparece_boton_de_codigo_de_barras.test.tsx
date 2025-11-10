import VentasScreen from "@/app/(tabs)/ventas";
import { AuthProvider } from "@/contexts/AuthProvider";
import { useVentas } from "@/hooks/useVentas";
import { render, screen, waitFor } from "@testing-library/react-native";

jest.mock("@/hooks/useVentas");

describe("Ventas - Escanear Código de Barras", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useVentas as jest.Mock).mockReturnValue({
      filteredProducts: [],
      ventaActual: [],
    });
  });

  test("Debe de mostrar un boton que diga 'Escanear codigo de barras'", async () => {
    render(<VentasScreen />, {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(screen.getByText("Escanear Código de Barras")).toBeTruthy();
    });
  });
});