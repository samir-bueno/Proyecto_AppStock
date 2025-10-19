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

  test("Se puede aumentar o disminuir el stock con botones + y -.", async () => {
    
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

    // Esperamos a que cargue los productos
    await waitFor(() => {
      expect(screen.queryByText("Cargando productos...")).toBeNull();
    });

    // Hago clic en el botón de editar
    expect(screen.getByText("Control de inventario")).toBeTruthy(); 
    fireEvent.press(screen.getByTestId("Editar"));

    // Esperamos a que se muestre el formulario de edición
    await waitFor(() => {
      expect(screen.getByText("Editar Producto")).toBeTruthy();
    });

    // comprobamos que el campo de nombre del producto está lleno correctamente
    expect(screen.getByTestId('Nombre del producto *')).toHaveProp('value', 'Test Product');
    
    // Comprobamos que el campo de cantidad está lleno correctamente 
    // y que el botón de restar cumple su funcion
    expect(screen.getByTestId('Cantidad *')).toHaveProp('value', '1');
    fireEvent.press(screen.getByTestId('minus'));

    // Esperamos a que se actualice el campo de cantidad
    await waitFor(() => {
        expect(screen.getByTestId('Cantidad *')).toHaveProp('value', '0');
    });

    fireEvent.press(screen.getByTestId('plus'));
    fireEvent.press(screen.getByTestId('plus'));

    // Esperamos a que se actualice el campo de cantidad
    await waitFor(() => {
        expect(screen.getByTestId('Cantidad *')).toHaveProp('value', '2');
    });
       
    expect(screen.getByText("Cancelar")).toBeTruthy();
    expect(screen.getByText("Guardar")).toBeTruthy();

    fireEvent.press(screen.getByText("Guardar"));

    await waitFor(() => {
      expect(screen.getByText("2")).toBeTruthy();
    }, { timeout: 5000 });
    
    expect(screen.queryByText("Editar Producto")).toBeNull();

    expect(screen.getByText("Test Product")).toBeTruthy();
    expect(screen.getByText("$10")).toBeTruthy();
    expect(screen.getByText("1234567890")).toBeTruthy();
    

}, 15000);
});