import Resumen from "@/app/(tabs)/resumen";
import { AuthProvider } from "@/contexts/AuthProvider";
import { NavigationContainer } from "@react-navigation/native";
import { render, screen, waitFor } from "@testing-library/react-native";


const mockUseAuth = {
 user: { id: "test-user-id", email: "test@example.com" },
 login: jest.fn(),
 logout: jest.fn(),
 register: jest.fn(),
};


jest.mock("@/contexts/AuthProvider", () => ({
 useAuth: () => mockUseAuth,
 AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));


const mockGetProductsDisponibleByOwner = jest.fn();
const mockGetProductsPorAgotarse = jest.fn();
const mockGetTotalGain = jest.fn();
const mockGetTotalCustomerDebt = jest.fn();


jest.mock("@/services/pocketbaseServices", () => ({
 getProductsDisponibleByOwner: (...args: any[]) =>
   mockGetProductsDisponibleByOwner(...args),
 getProductsPorAgotarse: (...args: any[]) =>
   mockGetProductsPorAgotarse(...args),
 getTotalGain: (...args: any[]) => mockGetTotalGain(...args),
 getTotalCustomerDebt: (...args: any[]) => mockGetTotalCustomerDebt(...args),
}));


describe("Pantalla de resumen", () => {
 beforeEach(() => {
   jest.clearAllMocks();
 });


 test("Si no hay dato se debe mostrar valor 0.", async () => {
   mockGetProductsDisponibleByOwner.mockImplementation(() =>
     Promise.resolve({
       success: true,
       data: [],
     })
   );
   mockGetProductsPorAgotarse.mockImplementation(() =>
     Promise.resolve({
       success: true,
       data: [],
     })
   );
   mockGetTotalGain.mockImplementation(() =>
     Promise.resolve({
       success: true,
       data: [],
     })
   );
   mockGetTotalCustomerDebt.mockImplementation(() =>
     Promise.resolve({
       success: true,
       data: [],
     })
   );


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
     expect(screen.getByTestId("Valor-ganancia")).toHaveTextContent("$0");
     expect(screen.getByText("Deuda de clientes")).toBeTruthy();
     expect(screen.getByTestId("Valor-deuda-clientes")).toHaveTextContent(
       "$0"
     );
     expect(screen.getByText("Productos disponibles")).toBeTruthy();
     expect(
       screen.getByTestId("Valor-productos-disponibles")
     ).toHaveTextContent("0");
     expect(screen.getByText("Productos por agotarse")).toBeTruthy();
     expect(
       screen.getByTestId("Valor-productos-por-agotarse")
     ).toHaveTextContent("0");
   });
 });
});
