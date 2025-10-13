import FormularioParaAgregarFiado from "@/components/fiados/agregar_cliente_fiado/formulario_para_agregar_fiado";
import {
  fireEvent,
  render,
} from "@testing-library/react-native";

test("Al cancelar el formulario, se debe cerrar sin guardar datos", () => {
  let formularioCerrado = false;
  let datosGuardados = false;

  const { getByText } = render(
    <FormularioParaAgregarFiado 
      alCerrarElFormulario={() => { formularioCerrado = true; }} 
      alGuardarLosDatosDelFormulario={() => { datosGuardados = true; }} 
      agregandoCliente={false}
      errorDuplicado={false}
    />
  );

  fireEvent.press(getByText("Cancelar"));

  expect(formularioCerrado).toBe(true);   
  expect(datosGuardados).toBe(false); 
});