import FormularioLogin from "@/components/authentication/formularioLogin";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";

test("Si la contraseña no tiene contenido deberá mostrar un mensaje de error.", async () => {
  render(
    <FormularioLogin
      alGuardarLosDatosDelFormulario={() => {}}
      cargando={false}
      errorServidor={""}
    />
  );

  fireEvent.press(screen.getByText("Ingresar"));

  await waitFor(() => {
    const errorMessage = screen.getByText("El campo 'contraseña' es obligatorio");
    expect(errorMessage).toBeTruthy();
  });
});