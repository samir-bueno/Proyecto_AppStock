import SigninForm from "@/app/(Auth)/signin";
import { AuthProvider } from "@/contexts/AuthProvider";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";

describe("Si los campos están vacíos se muestra un mensaje de error", () => {
  test("al enviar el formulario vacío, se muestran mensajes de error en todos los campos", async () => {
    render(<SigninForm />, {
      wrapper: AuthProvider,
    });

    // Acción: enviar formulario vacío
    fireEvent.press(screen.getByText("Registrarse"));

    // Verificación: se muestran mensajes de error en todos los campos
    await waitFor(() => {
      expect(screen.getByText("El campo 'nombre' es obligatorio")).toBeTruthy();
      expect(screen.getByText("El campo 'email' debe ser un correo válido")).toBeTruthy();
      expect(screen.getByText("El campo 'contraseña' es obligatorio")).toBeTruthy();
      expect(screen.getByText("El campo 'confirmación' es obligatorio")).toBeTruthy();
    });
  });
});
