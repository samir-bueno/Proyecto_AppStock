import Resumen from "@/app/(tabs)/resumen";
import { AuthProvider } from "@/contexts/AuthProvider";
import { render, screen } from "@testing-library/react-native";


describe("Pantalla de resumen", () => {
 test("Al entrar en 'Resumen', se muestran cuatro bloques con los siguientes titulos: Ganancias, Productos disponibles, Deuda de clientes y Productos por agotarse.", () => {
   render(<Resumen />, { wrapper: AuthProvider });


   expect(screen.getByText("Ganancias")).toBeTruthy();
   expect(screen.getByText("Deuda de clientes")).toBeTruthy();
   expect(screen.getByText("Productos disponibles")).toBeTruthy();
   expect(screen.getByText("Productos por agotarse")).toBeTruthy();
 });
});


