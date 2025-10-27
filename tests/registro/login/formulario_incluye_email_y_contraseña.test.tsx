import FormularioLogin from "@/components/authentication/formularioLogin";
import { render, screen } from "@testing-library/react-native";

test("Formulario de login debe incluir campos de email y contraseña.", () => {
  render(
    <FormularioLogin
      alGuardarLosDatosDelFormulario={() => {}}
      cargando={false}
      errorServidor={""}
    />
  );

  expect(screen.getByPlaceholderText("Email")).toBeTruthy();
  expect(screen.getByPlaceholderText("Contraseña")).toBeTruthy();
});
