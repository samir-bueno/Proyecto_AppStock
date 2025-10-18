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

describe("El producto aparece en la lista con los campos guardados", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("El nuevo producto debe aparecer con su nombre, precio y cantidad, junto a los botones editar y borrar", async () => {
    // Mock de createProduct para simular éxito
    (createProduct as jest.Mock).mockResolvedValue({
      success: true,
      data: { id: "new-product-123" },
    });

    // Mock de getProductsByOwner para devolver el nuevo producto
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

    await waitFor(() => {
      expect(screen.getByText("Laptop Gamer")).toBeTruthy();
      expect(screen.getByText("$1200")).toBeTruthy();
      expect(screen.getByText("5")).toBeTruthy();

      expect(screen.getByTestId("edit-button")).toBeTruthy();
      expect(screen.getByTestId("delete-button")).toBeTruthy();
    });

    // Verificar que se completó el proceso de guardado
    await waitFor(() => {
      expect(createProduct).toHaveBeenCalledWith({
        product_name: "Laptop Gamer",
        quantity: "5",
        price: "1200",
        barcode: "123456789",
        owner_id: "test-user-id",
      });
    });
  });
});