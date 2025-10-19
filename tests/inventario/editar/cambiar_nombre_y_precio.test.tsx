import InventarioScreen from "@/app/(tabs)/inventario";
import { AuthProvider } from "@/contexts/AuthProvider";
import { getProductsByOwner, updateProduct } from "@/services/pocketbaseServices";
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
  let updateProductMock = updateProduct as jest.Mock;
  
  beforeEach(() => {
    jest.clearAllMocks();

    

    (getProductsByOwnerMock).mockResolvedValue({
      success: true,
      data: [{ id: "test-product-id", product_name: "Test Product", ownerId: "test-user-id", quantity: "1", price: "10", barcode: "1234567890" }],
    });
    (updateProductMock).mockResolvedValue({
      success: true
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

    updateProductMock.mockImplementation(async (id, updatedData) => {
      if (id === "test-product-id") {
        // Simular la actualización en "base de datos"
        currentProductData = {
          ...currentProductData,
          product_name: updatedData.product_name,
          quantity: updatedData.quantity,
          price: updatedData.price
        };
      }
      return ({
        success: true
      });
    });
    
    render(<InventarioScreen />, {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(screen.queryByText("Cargando productos...")).toBeNull();
    });

    expect(screen.getByText("Control de inventario")).toBeTruthy(); 
    fireEvent.press(screen.getByTestId("Editar"));

    await waitFor(() => {
      expect(screen.getByText("Editar Producto")).toBeTruthy();
    });

    expect(screen.getByPlaceholderText('Nombre del producto *')).toBeTruthy();
    expect(screen.getByTestId('Nombre del producto *')).toHaveProp('value', 'Test Product');
    fireEvent.changeText(screen.getByTestId('Nombre del producto *'), 'Empanadas');
    
    expect(screen.getByPlaceholderText("Cantidad *")).toBeTruthy();
    expect(screen.getByTestId('Cantidad *')).toHaveProp('value', '1');
    fireEvent.changeText(screen.getByTestId('Cantidad *'), '20');

    await waitFor(() => {
        expect(screen.getByTestId('Nombre del producto *')).toHaveProp('value', 'Empanadas');
        expect(screen.getByTestId('Cantidad *')).toHaveProp('value', '20');
    });
    expect(screen.getByPlaceholderText("Precio *")).toBeTruthy();
    expect(screen.getByTestId('Precio *')).toHaveProp('value', '10');
    expect(screen.getByPlaceholderText("Codigo de barras (opcional)")).toBeTruthy();
       
    expect(screen.getByText("Cancelar")).toBeTruthy();
    expect(screen.getByText("Guardar")).toBeTruthy();

    fireEvent.press(screen.getByText("Guardar"));

    await waitFor(() => {
        expect(screen.getByText("Empanadas")).toBeTruthy();
        expect(screen.getByText("20")).toBeTruthy();
    }, { timeout: 5000 });

    expect(screen.queryByText("Editar Producto")).toBeNull();

    expect(screen.getByText("$10")).toBeTruthy();
    expect(screen.getByText("1234567890")).toBeTruthy();
    

}, 15000);
});