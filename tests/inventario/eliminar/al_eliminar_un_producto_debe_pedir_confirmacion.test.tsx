import InventarioScreen from "@/app/(tabs)/inventario";
import { AuthProvider } from "@/contexts/AuthProvider";
import { deleteProduct, getProductsByOwner } from "@/services/pocketbaseServices";
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


describe("Como operario Deseo ver la lista de productos y poder modificar su stock o eliminarlos Para mantener actualizado y limpio el inventario.", () => {
  
  let getProductsByOwnerMock = getProductsByOwner as jest.Mock;
  let deleteProductMock = deleteProduct as jest.Mock;
  
  beforeEach(() => {
    jest.clearAllMocks();

    

    (getProductsByOwnerMock).mockResolvedValue({
      success: true,
      data: [{ id: "test-product-id", product_name: "Test Product", ownerId: "test-user-id", quantity: "1", price: "10", barcode: "1234567890" }],
    });
    (deleteProductMock).mockResolvedValue({
      success: true
    });
  });

  test("Se puede cambiar el nombre y el precio", async () => {
    
    let currentProductData: any = {
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

   deleteProductMock.mockImplementation(async (id) => {
      if (id === "test-product-id") {
            // Modificamos 'currentProductData' para simular la eliminación local
            currentProductData = [];
            
            // volvemos a llamar a getProductsByOwner para actualizar la lista
            getProductsByOwnerMock.mockResolvedValue({
                success: true,
                data: [], // Lista vacía
            });

            return ({
              success: true,
            });
      }
      return ({
        success: false
      });
    });
    
    render(<InventarioScreen />, {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(screen.queryByText("Cargando productos...")).toBeNull();
    });

    expect(screen.getByText("Control de inventario")).toBeTruthy(); 
    fireEvent.press(screen.getByTestId("delete-button"));

    await waitFor(() => {
        expect(screen.getByText("¿Eliminar producto?")).toBeTruthy();
    });

    expect(screen.getByText('Estás a punto de eliminar el producto "Test Product". Esta acción no se puede deshacer.')).toBeTruthy();
    expect(screen.getByText("Cancelar")).toBeTruthy();
    expect(screen.getByText("Eliminar")).toBeTruthy();

    fireEvent.press(screen.getByText("Eliminar"));

    await waitFor(() => {
        expect(screen.getByText("No tienes productos registrados")).toBeTruthy();
    });


}, 15000);
});