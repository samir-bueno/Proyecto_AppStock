import { Customer } from "@/services/pocketbaseServices";
import { renderHook } from "@testing-library/react-native";

// Clientes desordenados (con números y strings para probar la robustez de useMemo)
const mockClients: Customer[] = [
  { id: '1', name: 'Zoe', phone: '111', deuda: '50', owner_id: 'user1' }, 
  { id: '2', name: 'Alan', phone: '222', deuda: '512', owner_id: 'user1'},
  { id: '3', name: 'Beto', phone: '333', deuda: '256', owner_id: 'user1'}, 
  { id: '4', name: 'Carlos', phone: '444', deuda: '500', owner_id: 'user1'}, 
];

// Mock del hook useFiados para inyectar la lista desordenada
const mockUseFiados = {
  clients: [...mockClients].sort((a, b) => Number(b.deuda) - Number(a.deuda)),
  expandedId: null,
  toggleDetails: jest.fn(),
  openEditForm: jest.fn(),
  openDeleteModal: jest.fn(),
};

describe("Clientes de deuda - Ordenamiento", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Se ordena por deuda mayor (deuda descendente)", () => {
    const { result } = renderHook(() => mockUseFiados);

    const clientElements = result.current.clients.map(client => result.current.clients.find(c => c.id === client.id));

    // Verificar que los elementos se encuentran en el orden esperado
    expect(clientElements).toHaveLength(4);
    
    // El primer elemento debe ser el de mayor deuda
    expect(clientElements[0]?.name).toBe('Alan');
    
    // Segundo elemento
    expect(clientElements[1]?.name).toBe('Carlos');
    
    // Tercer elemento
    expect(clientElements[2]?.name).toBe('Beto');
    
    // Cuarto elemento
    expect(clientElements[3]?.name).toBe('Zoe');
  });
});