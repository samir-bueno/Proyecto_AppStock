import SigninForm from "@/app/(Auth)/signin";
import { AuthProvider } from "@/contexts/AuthProvider";
import { render, screen } from "@testing-library/react-native";

describe("El formulario muestra campos: nombre, email, contraseña, repetir contraseña", () => {
  test("debe mostrar todos los campos del formulario de registro", () => {
    render(<SigninForm />, {
      wrapper: AuthProvider,
    });

    expect(screen.getByPlaceholderText("Nombre")).toBeTruthy();
    expect(screen.getByPlaceholderText("Correo electrónico")).toBeTruthy();
    expect(screen.getByPlaceholderText("Contraseña")).toBeTruthy();
    expect(screen.getByPlaceholderText("Confirmar contraseña")).toBeTruthy();
    expect(screen.getByText("Crear Cuenta")).toBeTruthy();
  });
});
