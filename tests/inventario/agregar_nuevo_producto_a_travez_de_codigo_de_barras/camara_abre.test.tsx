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

// Mock del hook useBarcodeScanner para que tenga permisos
jest.mock("@/hooks/useBarcodeScanner", () => ({
  useBarcodeScanner: () => ({
    hasPermission: true,
    permission: { granted: true },
    requestPermission: jest.fn(),
    scanned: false,
    handleBarcodeScanned: jest.fn(),
    resetScanner: jest.fn(),
  }),
}));

describe("Inventario - Camara", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getProductsByOwner as jest.Mock).mockResolvedValue({
      success: true,
      data: [],
    });
  });

  test("Al tocar el boton de camara se abre la camara", async () => {
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

    // verifica que la cámara está cerrada inicialmente
    expect(screen.queryByTestId("camera-modal")).toBeNull();

    fireEvent.press(screen.getByTestId("camera-button"));

    // verifica que la cámara se abrio
    await waitFor(() => {
      expect(screen.getByTestId("camera-modal")).toBeTruthy();
    });

    // verifica que es la cámara activa
    await waitFor(() => {
      expect(screen.getByTestId("camera-active-screen")).toBeTruthy();
    });

    // verifica que Las instrucciones de la cámara están visibles
    expect(screen.getByText("Enfoca el código de barras dentro del marco")).toBeTruthy();
  });
});