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

describe("Como operario Deseo ver la lista de productos y poder modificar su stock o eliminarlos Para mantener actualizado y limpio el inventario.", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getProductsByOwner as jest.Mock).mockResolvedValue({
      success: true,
      data: [{ id: "test-product-id", product_name: "Test Product", ownerId: "test-user-id", quantity: "1", price: "10", barcode: "1234567890" }],
    });
  });

  test("Se debe mostrar un formulario para realizar los cambios", async () => {
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
    expect(screen.getByPlaceholderText("Cantidad *")).toBeTruthy();
    expect(screen.getByTestId('Cantidad *')).toHaveProp('value', '1');
    expect(screen.getByPlaceholderText("Precio *")).toBeTruthy();
    expect(screen.getByTestId('Precio *')).toHaveProp('value', '10');
    expect(screen.getByPlaceholderText("Codigo de barras (opcional)")).toBeTruthy();
       
    expect(screen.getByText("Cancelar")).toBeTruthy();
    expect(screen.getByText("Guardar")).toBeTruthy();
  }, 15000)
});