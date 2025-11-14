import InventarioScreen from "@/app/(tabs)/inventario";
import { AuthProvider } from "@/contexts/AuthProvider";
import { getProductsByOwner } from "@/services/pocketbaseServices";
import { NavigationContainer } from "@react-navigation/native";
import {
  fireEvent,
  render,
  screen,
  waitFor
} from "@testing-library/react-native";

// Mock de los servicios de PocketBase
jest.mock("@/services/pocketbaseServices", () => ({
  getProductsByOwner: jest.fn(),
}));

// Mock del hook useAuth
const mockUseAuth = {
  user: { id: "test-user-id", email: "test@example.com" },
};

jest.mock("@/contexts/AuthProvider", () => ({
  useAuth: () => mockUseAuth,
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe("Inventario - formulario", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getProductsByOwner as jest.Mock).mockResolvedValue({
      success: true,
      data: [],
    });
  });

  test("Al tocar el botón 'Agregar nuevo producto', se despliega un formulario para escribir los datos", async () => {
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

    fireEvent.press(screen.getByText("Agregar Producto"));

    await waitFor(() => {
      expect(screen.getByText("Agregar Nuevo Producto")).toBeTruthy();
    });
  });
});