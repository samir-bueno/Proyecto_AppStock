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


 test("cada bloque muestra valores numericos", async () => {
   mockGetProductsDisponibleByOwner.mockImplementation(() =>
     Promise.resolve({
       success: true,
       data: [
         {
           id: "test-product-id",
           product_name: "Test Product",
           ownerId: "test-user-id",
           quantity: "8",
           price: "10",
           barcode: "1234567890",
         },
         {
           id: "test-product-id2",
           product_name: "Test Product 2",
           ownerId: "test-user-id",
           quantity: "24",
           price: "200",
           barcode: "123451240",
         },
       ],
     })
   );
   mockGetProductsPorAgotarse.mockImplementation(() =>
     Promise.resolve({
       success: true,
       data: [
         {
           id: "test-product-id3",
           product_name: "Test Product3",
           ownerId: "test-user-id",
           quantity: "4",
           price: "12",
           barcode: "61949492",
         },
         {
           id: "test-product-id4",
           product_name: "Test Product 4",
           ownerId: "test-user-id",
           quantity: "2",
           price: "202",
           barcode: "123451246",
         },
       ],
     })
   );
   mockGetTotalGain.mockImplementation(() =>
     Promise.resolve({
       success: true,
       data: 20000,
     })
   );
   mockGetTotalCustomerDebt.mockImplementation(() =>
     Promise.resolve({
       success: true,
       data: 3200,
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
     expect(screen.getByTestId("Valor-ganancia")).toHaveTextContent("$20000");
     expect(screen.getByText("Deuda de clientes")).toBeTruthy();
     expect(screen.getByTestId("Valor-deuda-clientes")).toHaveTextContent(
       "$3200"
     );
     expect(screen.getByText("Productos disponibles")).toBeTruthy();
     expect(
       screen.getByTestId("Valor-productos-disponibles")
     ).toHaveTextContent("2");
     expect(screen.getByText("Productos por agotarse")).toBeTruthy();
     expect(
       screen.getByTestId("Valor-productos-por-agotarse")
     ).toHaveTextContent("2");
   });
 });
});
