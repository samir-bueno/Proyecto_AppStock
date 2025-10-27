import FormularioLogin from "@/components/authentication/formularioLogin";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";

test("Si ambos campos(contraseña y email) no existen muestra un mensaje de error.", async () => {
  render(
    <FormularioLogin
      alGuardarLosDatosDelFormulario={() => {}}
      cargando={false}
      errorServidor={""}
    />
  );

  fireEvent.press(screen.getByText("Ingresar"));

  await waitFor(() => {
    expect(screen.getByText("El campo 'email' debe ser un correo válido")).toBeTruthy();
    expect(screen.getByText("El campo 'contraseña' es obligatorio")).toBeTruthy();
  });
});