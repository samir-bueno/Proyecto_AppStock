import BusquedaProductos from "@/components/ventas/busqueda";
import { Product } from "@/services/pocketbaseServices";
import { render, screen } from "@testing-library/react-native";

test("Al buscar un producto por nombre, solo se muestran productos que tienen al menos 1 unidad en stock", async () => {
  const mockProductos: Product[] = [
    { 
      id: "1", 
      owner_id: "pepe123", 
      product_name: "Laptop Gamer", 
      price: "1200", 
      quantity: "5",
      barcode: "123456789",
      created: "2023-01-01",
      updated: "2023-01-01"
    },
    { 
      id: "2", 
      owner_id: "pepe123", 
      product_name: "Mouse Inalámbrico", 
      price: "25", 
      quantity: "0",
      barcode: "987654321",
      created: "2023-01-01", 
      updated: "2023-01-01"
    },
    { 
      id: "3", 
      owner_id: "pepe123", 
      product_name: "Teclado Mecánico", 
      price: "80", 
      quantity: "1",
      barcode: "555555555",
      created: "2023-01-01",
      updated: "2023-01-01"
    }
  ];

  render(
    <BusquedaProductos
      agregarProducto={() => {}}
      valorBusqueda=""
      setValorBusqueda={() => {}}
      elBuscadorSeMuestra={true}
      setElBuscadorSeMuestra={() => {}}
      filtrarProductos={mockProductos}
      cargando={false}
    />
  );

  expect(screen.getByText("Laptop Gamer")).toBeTruthy();     
  expect(screen.getByText("Teclado Mecánico")).toBeTruthy(); 
  
  //NO debe mostrarse el producto sin stock
  expect(screen.queryByText("Mouse Inalámbrico")).toBeNull();  

  // adicional: Los productos mostrados indican su cantidad disponible
  expect(screen.getByText(/Cantidad: 5/)).toBeTruthy();
  expect(screen.getByText(/Cantidad: 1/)).toBeTruthy(); 
});