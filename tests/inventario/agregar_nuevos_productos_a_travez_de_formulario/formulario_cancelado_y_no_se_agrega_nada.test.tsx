import FormularioParaAgregarUnProducto from "@/components/inventario/agregar_producto/formulario_para_agregar_producto";
import { fireEvent, render } from "@testing-library/react-native";

test("Al cancelar el formulario, se debe cerrar sin guardar datos", () => {
  let formularioCerrado = false;
  let datosGuardados = false;

  const { getByText } = render(
    <FormularioParaAgregarUnProducto
      alCerrarElFormulario={() => {
        formularioCerrado = true;
      }}
      alGuardarLosDatosDelFormulario={() => {
        datosGuardados = true;
      }}
      agregandoProducto={false}
    />
  );

  fireEvent.press(getByText("Cancelar"));

  expect(formularioCerrado).toBe(true);
  expect(datosGuardados).toBe(false);
});