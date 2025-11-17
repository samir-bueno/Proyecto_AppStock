import Resumen from "@/app/(tabs)/resumen";
import { AuthProvider } from "@/contexts/AuthProvider";
import { NavigationContainer } from "@react-navigation/native";
import { render, screen, waitFor } from "@testing-library/react-native";


describe("Pantalla de resumen", () => {
 test("Al entrar en 'Resumen', se muestran cuatro bloques con los siguientes titulos: Ganancias, Productos disponibles, Deuda de clientes y Productos por agotarse.", async () => {
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <NavigationContainer>
        <AuthProvider>{children}</AuthProvider>
      </NavigationContainer>
    );

    render(<Resumen />, {
      wrapper: Wrapper,
    });

  await waitFor(() => {
   expect(screen.getByText("Ganancias")).toBeTruthy();
   expect(screen.getByText("Deuda de clientes")).toBeTruthy();
   expect(screen.getByText("Productos disponibles")).toBeTruthy();
   expect(screen.getByText("Productos por agotarse")).toBeTruthy();
  });
 });
});


