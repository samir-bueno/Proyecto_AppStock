import Tarjeta_fiado from "@/components/fiados/lista_de_fiados/tarjeta_fiado";
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

describe("resumen/clientes_deuda", () => {
 beforeEach(() => {
   jest.clearAllMocks();
 });

 test("para cada cliente aparecen los datos", async () => {
    const mockClientes = [
     {
       id: "test-client-id",
       name: "Test Client",
       phone: "123456789",
       deuda: "1000",
     },
     {
       id: "test-client-id2",
       name: "Test Client 2",
       phone: "987654321",
       deuda: "2000",
     },
   ];

   const mockRenderClientes = (cliente: any) => (
     <Tarjeta_fiado
       item={cliente}
       isExpanded={false}
       isFiadosScreen={true}
       onToggle={() => {}}
       onEdit={() => {}}
       onDelete={() => {}}
     />
   );

   render(<>{mockClientes.map(mockRenderClientes)}</>);

   await waitFor(() => {
     expect(screen.getByText("Test Client")).toBeTruthy();
     expect(screen.getByText("123456789")).toBeTruthy();
     expect(screen.getByText("$1000")).toBeTruthy();
     expect(screen.getByText("Test Client 2")).toBeTruthy();
     expect(screen.getByText("987654321")).toBeTruthy();
     expect(screen.getByText("$2000")).toBeTruthy();
   });
 });
});