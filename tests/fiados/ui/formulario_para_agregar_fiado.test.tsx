import FormularioParaAgregarFiado from "@/components/fiados/agregar_cliente_fiado/formulario_para_agregar_fiado";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";

describe("Como cajero, deseo registrar un nuevo cliente fiado con su nombre y telefono para mantener control de su deuda", () => {
  test("Si el nombre esta vacio, al presionar agregar, debe mostrarse un nombre de error", async () => {
    const { getByText } = render(
      <FormularioParaAgregarFiado
        alCerrarElFormulario={() => {}}
        alGuardarLosDatosDelFormulario={() => {}}
        agregandoCliente={false}
        errorDuplicado={false}
      />
    );

    fireEvent.press(getByText("Guardar"));
    await waitFor(() =>
      expect(
        screen.getByText("El campo 'nombre' debe contener al menos dos letras")
      ).toBeTruthy()
    );
  });
});
