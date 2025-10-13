import FormularioParaAgregarFiado from "@/components/fiados/agregar_cliente_fiado/formulario_para_agregar_fiado";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";

test("Si el nombre es igual a otro, al presionar 'Guardar' se mostrara un mensaje de error", async () => {
    const { getByText } = render(
      <FormularioParaAgregarFiado 
        alCerrarElFormulario={() => {}} 
        alGuardarLosDatosDelFormulario={() => {}} 
        agregandoCliente={false}
        errorDuplicado={true}
      />
    );

    fireEvent.press(getByText("Guardar"));
    await waitFor(() =>
      expect(
        screen.getByText("Ya existe un cliente registrado con este nombre")
      ).toBeTruthy()
    );
  });
