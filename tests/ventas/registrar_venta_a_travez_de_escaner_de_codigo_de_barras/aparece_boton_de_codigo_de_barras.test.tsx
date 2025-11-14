import VentasScreen from "@/app/(tabs)/ventas";
import { AuthProvider } from "@/contexts/AuthProvider";
import { useVentas } from "@/hooks/useVentas";
import { render, screen, waitFor } from "@testing-library/react-native";

jest.mock("@/hooks/useVentas");

describe("Ventas - Escanear Código de Barras", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useVentas as jest.Mock).mockReturnValue({
      // Estados principales
      filteredProducts: [],
      ventaActual: [],
      products: [],
      
      // Estados necesarios para evitar errores
      user: { id: "test-user" },
      loading: false,
      busqueda: "",
      isSearchFocused: false,
      showConfirmModal: false,
      showCustomerModal: false,
      customers: [],
      selectedCustomer: null,
      
      // Funciones necesarias para evitar errores
      agregarProductoAVenta: jest.fn(),
      handleQuantityChange: jest.fn(),
      handleVentaNormal: jest.fn(),
      handleVentaFiado: jest.fn(),
      confirmarVenta: jest.fn(),
      confirmarVentaFiada: jest.fn(),
      cancelarVenta: jest.fn(),
      cancelarSeleccionCliente: jest.fn(),
      setbusqueda: jest.fn(),
      setIsSearchFocused: jest.fn(),
      setShowConfirmModal: jest.fn(),
      setShowCustomerModal: jest.fn(),
      agregarProductoPorCodigoBarras: jest.fn(),
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