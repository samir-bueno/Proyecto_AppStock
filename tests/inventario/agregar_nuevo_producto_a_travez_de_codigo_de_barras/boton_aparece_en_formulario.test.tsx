import InventarioScreen from "@/app/(tabs)/inventario";
import { AuthProvider } from "@/contexts/AuthProvider";
import { getProductsByOwner } from "@/services/pocketbaseServices";
import {
  fireEvent,
  render,
  screen,
  waitFor
} from "@testing-library/react-native";

// Mock de los servicios de PocketBase
jest.mock("@/services/pocketbaseServices", () => ({
  getProductsByOwner: jest.fn(),
}));

// Mock del hook useAuth
const mockUseAuth = {
  user: { id: "test-user-id", email: "test@example.com" },
};

jest.mock("@/contexts/AuthProvider", () => ({
  useAuth: () => mockUseAuth,
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe("Inventario - Botón de cámara", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getProductsByOwner as jest.Mock).mockResolvedValue({
      success: true,
      data: [],
    });
  });

  test("TIene que haber un boton o icono de camara", async () => {
    render(<InventarioScreen />, {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(screen.queryByText("Cargando productos...")).toBeNull();
    });

    // Abrir formulario
    fireEvent.press(screen.getByText("Agregar Producto"));

    await waitFor(() => {
      expect(screen.getByText("Agregar Nuevo Producto")).toBeTruthy();
    });

    // Verificar que el botón de cámara está presente
    expect(screen.getByTestId("camera-button")).toBeTruthy();
  });
});