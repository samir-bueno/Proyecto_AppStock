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
  createProduct: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
}));

// Mock del hook useAuth
const mockUseAuth = {
  user: { id: "test-user-id", email: "test@example.com" },
  login: jest.fn(),
  logout: jest.fn(),
  register: jest.fn(),
};

jest.mock("@/contexts/AuthProvider", () => ({
  useAuth: () => mockUseAuth,
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe("Despliegue del formulario al toco el boton Agregar Producto", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getProductsByOwner as jest.Mock).mockResolvedValue({
      success: true,
      data: [],
    });
  });

  test("Al tocar el botón 'Agregar Producto', se despliega un formulario para escribir los datos", async () => {
    render(<InventarioScreen />, {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(screen.queryByText("Cargando productos...")).toBeNull();
    });

    fireEvent.press(screen.getByText("Agregar Producto"));

    await waitFor(() =>
      expect(
        screen.getByText("Agregar Nuevo Producto")
      ).toBeTruthy()
    );
  });
});