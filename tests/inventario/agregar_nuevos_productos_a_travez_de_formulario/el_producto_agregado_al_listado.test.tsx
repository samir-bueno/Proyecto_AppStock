import InventarioScreen from "@/app/(tabs)/inventario";
import { AuthProvider } from "@/contexts/AuthProvider";
import { createProduct, getProductsByOwner } from "@/services/pocketbaseServices";
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

describe("El producto se agrego al listado", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getProductsByOwner as jest.Mock).mockResolvedValue({
      success: true,
      data: [],
    });
  });

  test("Al tocar el botón 'Agregar' con todos los campos válidos, el producto se agrega al listado", async () => {
    // Mock de createProduct
    (createProduct as jest.Mock).mockResolvedValue({
      success: true,
      data: { id: "new-product-123" },
    });

    // Mock de getProductsByOwner para devolver el nuevo producto después de guardar
    (getProductsByOwner as jest.Mock)
      .mockResolvedValueOnce({  // Primera llamada - lista vacía
        success: true,
        data: [],
      })
      .mockResolvedValueOnce({  // Segunda llamada - después de agregar
        success: true,
        data: [
          {
            id: "new-product-123",
            product_name: "Laptop Gamer",
            quantity: "5",
            price: "1200",
            barcode: "123456789",
            owner_id: "test-user-id"
          }
        ],
      });

    render(<InventarioScreen />, {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(screen.queryByText("Cargando productos...")).toBeNull();
    });

    fireEvent.press(screen.getByText("Agregar Producto"));

    await waitFor(() => {
      expect(screen.getByText("Agregar Nuevo Producto")).toBeTruthy();
    });

    fireEvent.changeText(screen.getByPlaceholderText("Nombre del producto *"), "Laptop Gamer");
    fireEvent.changeText(screen.getByPlaceholderText("Cantidad *"), "5");
    fireEvent.changeText(screen.getByPlaceholderText("Precio *"), "1200");
    fireEvent.changeText(screen.getByPlaceholderText("Codigo de barras (opcional)"), "123456789");

    fireEvent.press(screen.getByText("Guardar"));

    // Verificar que se llamó a createProduct con los datos correctos
    await waitFor(() => {
      expect(createProduct).toHaveBeenCalledWith({
        product_name: "Laptop Gamer",
        quantity: "5",
        price: "1200",
        barcode: "123456789",
        owner_id: "test-user-id",
      });
    });

    // Verificar que el producto aparece en el listado
    await waitFor(() => {
      expect(screen.getByText("Laptop Gamer")).toBeTruthy();
      expect(screen.getByText("$1200")).toBeTruthy();
      expect(screen.getByText("5")).toBeTruthy();
    });

    // Verificar que se recargaron los productos (se llamó getProductsByOwner nuevamente)
    await waitFor(() => {
      expect(getProductsByOwner).toHaveBeenCalledTimes(2);
    });
  });
});