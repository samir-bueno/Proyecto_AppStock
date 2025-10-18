import InventarioScreen from "@/app/(tabs)/inventario";
import { AuthProvider } from "@/contexts/AuthProvider";
import { getProductsByOwner } from "@/services/pocketbaseServices";
import { render, screen, waitFor } from "@testing-library/react-native";

// Mock de los servicios
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

describe("Productos agotados en inventario", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Si un producto tiene stock 0, se marca encima como agotado", async () => {
    // Mock de productos - uno con stock 0 y otro con stock disponible
    const mockProduct = [
      {
        id: "1",
        product_name: "Laptop Gamer",
        quantity: "0",
        price: "1200",
        barcode: "123456789",
        owner_id: "test-user-id",
        created: "2023-01-01",
        updated: "2023-01-01"
      },
    ];

    // Mock de getProductsByOwner para devolver los productos
    (getProductsByOwner as jest.Mock).mockResolvedValue({
      success: true,
      data: mockProduct,
    });

    render(<InventarioScreen />, {
      wrapper: AuthProvider,
    });

    // Esperar a que carguen los productos
    await waitFor(() => {
      expect(screen.queryByText("Cargando productos...")).toBeNull();
    });

    // Verificar que ambos productos se muestran
    expect(screen.getByText("Laptop Gamer")).toBeTruthy();

    // Verificar que el producto con stock 0 muestra "AGOTADO"
    expect(screen.getByText("AGOTADO")).toBeTruthy();
  });
});