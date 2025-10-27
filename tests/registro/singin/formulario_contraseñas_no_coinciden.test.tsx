import SigninForm from "@/app/(Auth)/signin";
import { AuthProvider } from "@/contexts/AuthProvider";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";

describe("Si las contraseñas no coinciden, se muestra un mensaje de error", () => {
  test("al ingresar contraseñas diferentes, se muestra error de coincidencia", async () => {
    render(<SigninForm />, {
      wrapper: AuthProvider,
    });

    fireEvent.changeText(screen.getByPlaceholderText("Nombre"), "Juan Perez");
    fireEvent.changeText(
      screen.getByPlaceholderText("Correo electrónico"),
      "test@test.com"
    );
    fireEvent.changeText(
      screen.getByPlaceholderText("Contraseña"),
      "password123"
    );
    fireEvent.changeText(
      screen.getByPlaceholderText("Confirmar contraseña"),
      "diferente456"
    );

    fireEvent.press(screen.getByText("Registrarse"));

    await waitFor(() => {
      expect(screen.getByText("Las contraseñas no coinciden")).toBeTruthy();
    });
  });
});
