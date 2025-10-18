import FormularioParaAgregarUnProducto from "@/components/inventario/agregar_producto/formulario_para_agregar_producto";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";

describe("Formulario muestra mensajes de error para los diferentes campos", () => {
  test("Si intento guardar sin nombre, debe mostrar error de nombre", async () => {
    const mockGuardar = jest.fn();

    render(
      <FormularioParaAgregarUnProducto
        alCerrarElFormulario={() => {}}
        alGuardarLosDatosDelFormulario={mockGuardar}
        agregandoProducto={false}
      />
    );

    // Llenar cantidad y precio pero NO nombre
    fireEvent.changeText(screen.getByPlaceholderText("Cantidad *"), "5");
    fireEvent.changeText(screen.getByPlaceholderText("Precio *"), "100");

    fireEvent.press(screen.getByText("Guardar"));

    await waitFor(() => {
      expect(screen.getByText("El campo 'nombre' debe contener al menos dos letras")).toBeTruthy();
    });

  });

  test("Si intento guardar sin cantidad, debe mostrar error de cantidad", async () => {
    const mockGuardar = jest.fn();

    render(
      <FormularioParaAgregarUnProducto
        alCerrarElFormulario={() => {}}
        alGuardarLosDatosDelFormulario={mockGuardar}
        agregandoProducto={false}
      />
    );

    // Llena nombre y precio pero NO cantidad
    fireEvent.changeText(screen.getByPlaceholderText("Nombre del producto *"), "Laptop");
    fireEvent.changeText(screen.getByPlaceholderText("Precio *"), "100");

    fireEvent.press(screen.getByText("Guardar"));

    await waitFor(() => {
      expect(screen.getByText("El campo 'cantidad' es obligatorio")).toBeTruthy();
    });

  });

  test("Si intento guardar sin precio, debe mostrar error de precio", async () => {
    const mockGuardar = jest.fn();

    render(
      <FormularioParaAgregarUnProducto
        alCerrarElFormulario={() => {}}
        alGuardarLosDatosDelFormulario={mockGuardar}
        agregandoProducto={false}
      />
    );

    // Llenar nombre y cantidad pero NO precio
    fireEvent.changeText(screen.getByPlaceholderText("Nombre del producto *"), "Laptop");
    fireEvent.changeText(screen.getByPlaceholderText("Cantidad *"), "5");

    fireEvent.press(screen.getByText("Guardar"));

    await waitFor(() => {
      expect(screen.getByText("El campo 'precio' es obligatorio")).toBeTruthy();
    });

  });

  test("Si intento guardar con nombre muy corto, debe mostrar error", async () => {
    const mockGuardar = jest.fn();

    render(
      <FormularioParaAgregarUnProducto
        alCerrarElFormulario={() => {}}
        alGuardarLosDatosDelFormulario={mockGuardar}
        agregandoProducto={false}
      />
    );

    fireEvent.changeText(screen.getByPlaceholderText("Nombre del producto *"), "A");
    fireEvent.changeText(screen.getByPlaceholderText("Cantidad *"), "5");
    fireEvent.changeText(screen.getByPlaceholderText("Precio *"), "100");

    fireEvent.press(screen.getByText("Guardar"));

    await waitFor(() => {
      expect(screen.getByText("El campo 'nombre' debe contener al menos dos letras")).toBeTruthy();
    });
  });
});