import Resumen from "@/app/(tabs)/resumen";
import { AuthProvider } from "@/contexts/AuthProvider";
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


 test("Las ganancias se muestran en formato de moneda ($2000).", async () => {
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
       data: 20000,
     })
   );
   mockGetTotalCustomerDebt.mockImplementation(() =>
     Promise.resolve({
       success: true,
       data: 3200,
     })
   );


   render(<Resumen />, { wrapper: AuthProvider });


   await waitFor(() => {
     expect(screen.getByText("Ganancias")).toBeTruthy();
     expect(screen.getByTestId("Valor-ganancia")).toHaveTextContent("$20000");
     expect(screen.getByText("Deuda de clientes")).toBeTruthy();
     expect(screen.getByTestId("Valor-deuda-clientes")).toHaveTextContent(
       "$3200"
     );
   });
 });
});




