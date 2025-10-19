import InventarioScreen from "@/app/(tabs)/inventario";
import { AuthProvider } from "@/contexts/AuthProvider";
import { getProductsByOwner } from "@/services/pocketbaseServices";
import {
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


describe("Como operario Deseo ver la lista de productos y poder modificar su stock o eliminarlos Para mantener actualizado y limpio el inventario.", () => {
  
  let getProductsByOwnerMock = getProductsByOwner as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    

    (getProductsByOwnerMock).mockResolvedValue({
      success: true,
      data: [{ id: "test-product-id", product_name: "Test Product", ownerId: "test-user-id", quantity: "1", price: "10", barcode: "1234567890" }],
    });
  });

  test("Se puede cambiar el nombre y el precio", async () => {
    
    let currentProductData = {
      id: "test-product-id", 
      product_name: "Test Product", 
      ownerId: "test-user-id", 
      quantity: "1", 
      price: "10", 
      barcode: "1234567890"
    };

    getProductsByOwnerMock.mockImplementation(() => Promise.resolve({
      success: true,
      data: [currentProductData]
    }));
    
    render(<InventarioScreen />, {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(screen.queryByText("Cargando productos...")).toBeNull();
    });

    expect(screen.getByText("Control de inventario")).toBeTruthy(); 
    expect(screen.getByTestId("delete-button"));

}, 15000);
});