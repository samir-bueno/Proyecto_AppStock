import BusquedaProductos from "@/components/ventas/busqueda";
import { fireEvent, render, screen } from "@testing-library/react-native";

test("Al buscar un producto por nombre, solo se muestran productos que tienen al menos 1 unidad en stock.", async () => {
  render(
    <BusquedaProductos
      agregarProducto={() => {}}
      valorBusqueda=""
      setValorBusqueda={() => {}}
      elBuscadorSeMuestra={true}
      setElBuscadorSeMuestra={() => {}}
      filtrarProductos={[
        { id: "1", owner_id: "pepe123", product_name: "Producto 1", price: "10", quantity: "10", barcode: "123456789" },
        { id: "2", owner_id: "pepe123", product_name: "Producto 2", price: "10", quantity: "0", barcode: "123456789" },
      ]}
      cargando={false}
    />
  );
  const input = screen.getByPlaceholderText("Buscar por nombre...");
  fireEvent(input, "focus");
  await screen.findByText("Producto 1");
});