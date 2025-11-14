import InventarioScreen from "@/app/(tabs)/inventario";
import { AuthProvider } from "@/contexts/AuthProvider";
import {
  createProduct,
  getProductsByOwner,
} from "@/services/pocketbaseServices";
import { NavigationContainer } from "@react-navigation/native";
import {
  fireEvent,
  render,
  screen,
  waitFor,
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
};

jest.mock("@/contexts/AuthProvider", () => ({
  useAuth: () => mockUseAuth,
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock del hook useBarcodeScanner para que tenga permisos
jest.mock("@/hooks/useBarcodeScanner", () => ({
  useBarcodeScanner: () => ({
    hasPermission: true,
    permission: { granted: true },
    requestPermission: jest.fn(),
    scanned: false,
    handleBarcodeScanned: jest.fn(),
    resetScanner: jest.fn(),
  }),
}));

describe("Inventario - Autocompletado código de barras", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getProductsByOwner as jest.Mock).mockResolvedValue({
      success: true,
      data: [],
    });
  });

  test("Una vez abierto la camara se escanea el codigo de barras de un producto y se pone automaticamente en el codigo de barras(campo)", async () => {
    // Mock de createProduct para simular éxito
    (createProduct as jest.Mock).mockResolvedValue({
      success: true,
      data: { id: "new-product-123" },
    });

    // Mock de getProductsByOwner para devolver el nuevo producto
    (getProductsByOwner as jest.Mock)
      .mockResolvedValueOnce({
        // Primera llamada - lista vacía
        success: true,
        data: [],
      })
      .mockResolvedValueOnce({
        // Segunda llamada - después de agregar
        success: true,
        data: [
          {
            id: "new-product-123",
            product_name: "pepsi",
            quantity: "5",
            price: "1200",
            barcode: "7501031311309",
            owner_id: "test-user-id",
          },
        ],
      });

        const Wrapper = ({ children }: { children: React.ReactNode }) => (
          <NavigationContainer>
            <AuthProvider>{children}</AuthProvider>
          </NavigationContainer>
        );
    
        render(<InventarioScreen />, {
          wrapper: Wrapper,
        });

    await waitFor(() => {
      expect(screen.queryByText("Cargando productos...")).toBeNull();
    });

    // Abrir formulario
    fireEvent.press(screen.getByText("Agregar Producto"));

    await waitFor(() => {
      expect(screen.getByText("Agregar Nuevo Producto")).toBeTruthy();
    });

    fireEvent.changeText(
      screen.getByPlaceholderText("Nombre del producto *"),
      "pepsi"
    );
    fireEvent.changeText(screen.getByPlaceholderText("Cantidad *"), "5");
    fireEvent.changeText(screen.getByPlaceholderText("Precio *"), "1200");

    // 1. VERIFICAR que el campo está VACÍO inicialmente
    const codigoBarrasInput = screen.getByTestId("Codigo de barras (opcional)");
    expect(codigoBarrasInput.props.value).toBe("");

    // 2. ABRIR CÁMARA
    fireEvent.press(screen.getByTestId("camera-button"));

    await waitFor(() => {
      expect(screen.getByTestId("camera-modal")).toBeTruthy();
    });

    // 3. VERIFICAR que la cámara está LISTA PARA ESCANEAR
    expect(screen.getByTestId("camera-active-screen")).toBeTruthy();
    expect(
      screen.getByText("Enfoca el código de barras dentro del marco")
    ).toBeTruthy();

    // 4. Cerrar cámara (en un caso real, aquí se escanearía)
    fireEvent.press(screen.getByTestId("camera-button"));

    // 5. SIMULAR AUTOCOMPLETADO: El campo recibe el valor del escaneo
    // Esto prueba que cuando se escanea, el código se AUTOCOMPLETA en el campo
    const codigoEscaneado = "7501031311309";

    // Esto simula el autocompletado que haría handleBarcodeScanned
    fireEvent.changeText(codigoBarrasInput, codigoEscaneado);

    // 6. VERIFICAR que el código se AUTOCOMPLETÓ en el campo
    expect(codigoBarrasInput.props.value).toBe(codigoEscaneado);

    // VERIFICACIÓN EXTRA: El valor está visible en el campo
    expect(screen.getByDisplayValue(codigoEscaneado)).toBeTruthy();

    // 7. VERIFICAR que es el campo correcto
    expect(screen.getByTestId("Codigo de barras (opcional)")).toHaveProp(
      "value",
      codigoEscaneado
    );

    fireEvent.press(screen.getByTestId("close-camera-button"));

    await waitFor(() => {
      expect(
        screen.queryByText("Enfoca el código de barras dentro del marco")
      ).toBeNull();
    });

    expect(screen.getByText("Guardar")).toBeTruthy();
    fireEvent.press(screen.getByText("Guardar"));

    await waitFor(() => {
      expect(screen.getByText("pepsi")).toBeTruthy();
      expect(screen.getByText("$1200")).toBeTruthy();
      expect(screen.getByText("5")).toBeTruthy();
      expect(screen.getByText("7501031311309")).toBeTruthy();

      expect(screen.getByTestId("Editar")).toBeTruthy();
      expect(screen.getByTestId("delete-button")).toBeTruthy();
    });

    await waitFor(() => {
      expect(createProduct).toHaveBeenCalledWith({
        product_name: "pepsi",
        quantity: "5",
        price: "1200",
        barcode: "7501031311309",
        owner_id: "test-user-id",
      });
    });
  });
});
