import FormularioParaAgregarUnProducto from "@/components/inventario/agregar_producto/formulario_para_agregar_producto";
import { fireEvent, render, screen } from "@testing-library/react-native";

describe("Formulario permite ingresar datos del producto", () => {
  test("El formulario permite ingresar nombre del producto, precio, cantidad inicial", () => {
    let formularioCerrado = false;
    let datosGuardados = false;

    render(
      <FormularioParaAgregarUnProducto
        alCerrarElFormulario={() => { formularioCerrado = true; }}
        alGuardarLosDatosDelFormulario={() => { datosGuardados = false; }}
        agregandoProducto={false}
      />
    );

    // 1. Verificar que los campos están presentes
    expect(screen.getByPlaceholderText("Nombre del producto *")).toBeTruthy();
    expect(screen.getByPlaceholderText("Cantidad *")).toBeTruthy();
    expect(screen.getByPlaceholderText("Precio *")).toBeTruthy();
    expect(screen.getByPlaceholderText("Codigo de barras (opcional)")).toBeTruthy();

    // 2. Verificar que se puede escribir en los campos
    const nombreInput = screen.getByPlaceholderText("Nombre del producto *");
    const cantidadInput = screen.getByPlaceholderText("Cantidad *");
    const precioInput = screen.getByPlaceholderText("Precio *");
    const codigoInput = screen.getByPlaceholderText("Codigo de barras (opcional)");

    // Escribir en los campos
    fireEvent.changeText(nombreInput, "Laptop Gamer");
    fireEvent.changeText(cantidadInput, "5");
    fireEvent.changeText(precioInput, "1200");
    fireEvent.changeText(codigoInput, "123456789");

    // 3. Verificar que los valores se actualizaron
    expect(nombreInput.props.value).toBe("Laptop Gamer");
    expect(cantidadInput.props.value).toBe("5");
    expect(precioInput.props.value).toBe("1200");
    expect(codigoInput.props.value).toBe("123456789");

  });
});