import Login from "@/app/(Auth)/login";
import { useAuth } from "@/contexts/AuthProvider";
import { fireEvent, render, screen } from "@testing-library/react-native";

jest.mock("@/contexts/AuthProvider");
jest.mock("@/services/pocketbaseServices");

const mockedUseAuth = useAuth as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

test("Si el email no existe muestra un mensaje de error.", async () => {
  // Configuración del Mock de useAuth
  mockedUseAuth.mockReturnValue({
    register: jest.fn(),
    login: jest.fn().mockResolvedValue({ success: false, error: "failed to authenticated." }),
    logout: jest.fn(),
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  render(<Login />);

  fireEvent.changeText(screen.getByPlaceholderText("Email"), "test@test.com");
  fireEvent.changeText(screen.getByPlaceholderText("Contraseña"), "Contraseña123");
  fireEvent.press(screen.getByText("Ingresar"));

  await screen.findByText("Credenciales incorrectas");

}); 