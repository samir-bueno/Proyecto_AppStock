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

describe("Inventario muestra lista de productos", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Desde el panel 'inventario' se muestra una lista con el nombre, precio y cantidad de cada producto", async () => {
    // Mock de productos
    const mockProducts = [
      {
        id: "1",
        product_name: "Laptop Gamer",
        quantity: "5",
        price: "1200",
        barcode: "123456789",
        owner_id: "test-user-id",
        created: "2023-01-01",
        updated: "2023-01-01"
      },
      {
        id: "2", 
        product_name: "Mouse Inalámbrico",
        quantity: "10",
        price: "25",
        barcode: "987654321",
        owner_id: "test-user-id",
        created: "2023-01-01",
        updated: "2023-01-01"
      }
    ];

    // Mock de getProductsByOwner para devolver los productos
    (getProductsByOwner as jest.Mock).mockResolvedValue({
      success: true,
      data: mockProducts,
    });

    render(<InventarioScreen />, {
      wrapper: AuthProvider,
    });

    // Esperar a que carguen los productos
    await waitFor(() => {
      expect(screen.queryByText("Cargando productos...")).toBeNull();
    });

    // Verificar que se muestra una lista con el nombre, precio y cantidad de cada producto
    expect(screen.getByText("Laptop Gamer")).toBeTruthy();
    expect(screen.getByText("$1200")).toBeTruthy(); 
    expect(screen.getByText("5")).toBeTruthy(); 

    expect(screen.getByText("Mouse Inalámbrico")).toBeTruthy(); 
    expect(screen.getByText("$25")).toBeTruthy(); 
    expect(screen.getByText("10")).toBeTruthy(); 
  });
});