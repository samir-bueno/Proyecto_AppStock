import SigninForm from "@/app/(Auth)/signin";
import { useAuth } from "@/contexts/AuthProvider";
import { checkEmailExists } from "@/services/pocketbaseServices";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";

jest.mock("@/contexts/AuthProvider");
jest.mock("@/services/pocketbaseServices");

const mockedUseAuth = useAuth as jest.Mock;
const mockedCheckEmailExists = checkEmailExists as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

test("Si ya existe un email y se usa el mismo deberia mostrarse un mensaje de error.", async () => {
  // Configuración del Mock de useAuth
  mockedUseAuth.mockReturnValue({
    register: jest.fn().mockResolvedValue({ success: false, error: "Registro fallido" }),
    login: jest.fn(),
    logout: jest.fn(),
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  mockedCheckEmailExists.mockResolvedValue(true);

  render(<SigninForm />);

  fireEvent.changeText(screen.getByPlaceholderText("Nombre"), "Test User");
  fireEvent.changeText(screen.getByPlaceholderText("Correo electrónico"), "test@existente.com");
  fireEvent.changeText(screen.getByPlaceholderText("Contraseña"), "Contraseña123");
  fireEvent.changeText(screen.getByPlaceholderText("Confirmar contraseña"), "Contraseña123");

  fireEvent.press(screen.getByText("Registrarse"));

  await waitFor(() => {
    const errorMessage = screen.getByText("Este email ya está registrado");
    expect(errorMessage).toBeTruthy();
  });
});