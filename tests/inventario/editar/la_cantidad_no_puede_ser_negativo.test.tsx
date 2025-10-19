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

  test("No se puede reducir el stock a un número negativo.", async () => {
    
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

    // comprobamos que el campo de nombre tenga el valor correcto
    expect(screen.getByTestId('Nombre del producto *')).toHaveProp('value', 'Test Product');
    
    // Comprobamos que el campo de cantidad está lleno correctamente 
    // y que el botón de restar cumple su funcion
    expect(screen.getByTestId('Cantidad *')).toHaveProp('value', '1');

    // precionamos 5 veces el botón de restar para ver si puede ser negativo
    fireEvent.press(screen.getByTestId('minus'));
    fireEvent.press(screen.getByTestId('minus'));
    fireEvent.press(screen.getByTestId('minus'));
    fireEvent.press(screen.getByTestId('minus'));
    fireEvent.press(screen.getByTestId('minus'));

    // Esperamos a que se actualice el campo de cantidad y comprobamos que da 0
    await waitFor(() => {
        expect(screen.getByTestId('Cantidad *')).toHaveProp('value', '0');
    });

    fireEvent.changeText(screen.getByTestId('Cantidad *'), '-20');
    fireEvent.press(screen.getByText("Guardar"));

    // Esperamos a que tire error
    await waitFor(() => {
        expect(screen.getByText("La cantidad debe ser un número válido mayor o igual a 0.")).toBeTruthy();
    }); 

}, 15000);
});