import SigninForm from "@/app/(Auth)/signin";
import { AuthProvider } from "@/contexts/AuthProvider";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";

const mockPush = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  Link: ({ children }: any) => children,
}));

const mockRegister = jest.fn();

jest.mock("@/contexts/AuthProvider", () => ({
  useAuth: () => ({
    register: mockRegister,
  }),
}));

describe("Al registrarse correctamente, el usuario es dirigido al login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRegister.mockResolvedValue({
      success: true,
      error: null,
    });
  });

  test("redirección exitosa al login después del registro", async () => {
    render(<SigninForm />, {
      wrapper: AuthProvider,
    });

    fireEvent.changeText(screen.getByPlaceholderText("Nombre"), "Juan Perez");
    fireEvent.changeText(
      screen.getByPlaceholderText("Correo electrónico"),
      "juan@test.com"
    );
    fireEvent.changeText(
      screen.getByPlaceholderText("Contraseña"),
      "mipassword123"
    );
    fireEvent.changeText(
      screen.getByPlaceholderText("Confirmar contraseña"),
      "mipassword123"
    );

    fireEvent.press(screen.getByText("Registrarse"));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/(Auth)/login");
    });

    // Verificar que se llamó al registro con datos correctos
    expect(mockRegister).toHaveBeenCalledWith({
      name: "Juan Perez",
      email: "juan@test.com",
      password: "mipassword123",
      passwordConfirm: "mipassword123",
    });
  });
});
