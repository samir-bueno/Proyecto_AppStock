import Login from "@/app/(Auth)/login";
import { AuthProvider } from "@/contexts/AuthProvider";
import {
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react-native";

const mockReplace = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
  Link: ({ children }: any) => children,
}));


jest.mock("@/contexts/AuthProvider", () => ({
  useAuth: () => ({
    login: jest.fn().mockResolvedValue({ success: true, error: null }),
    user: null,
    isAuthenticated: false,
    isLoading: false,
  }),
}));

describe("Al ingresar correctamente, el usuario es redirigido a la pantalla principal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("redirección exitosa a ventas después del login", async () => {
    render(<Login />, {
      wrapper: AuthProvider,
    });

    fireEvent.changeText(screen.getByPlaceholderText("Email"), "test@test.com");
    fireEvent.changeText(screen.getByPlaceholderText("Contraseña"), "Contraseña123");
    fireEvent.press(screen.getByText("Ingresar"));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/(tabs)/ventas");
    });
  });
});