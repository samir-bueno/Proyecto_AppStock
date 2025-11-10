import VentasScreen from "@/app/(tabs)/ventas";
import { AuthProvider } from "@/contexts/AuthProvider";
import { useVentas } from "@/hooks/useVentas";
import { Product, VentaProduct } from "@/services/pocketbaseServices";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";

jest.mock("@/hooks/useVentas");

jest.mock("@/hooks/useBarcodeScanner", () => ({
  useBarcodeScanner: () => ({
    hasPermission: true,
    permission: { granted: true },
    requestPermission: jest.fn(),
    scanned: false,
    handleBarcodeScanned: jest.fn(),
    resetScanner: jest.fn(),
  }),
}));

describe("Ventas - Escanear Código de Barras", () => {
  const mockAgregarProductoAVenta = jest.fn();
  const mockProductoConStock: Product = {
    id: "1",
    owner_id: "test-user",
    product_name: "Coca Cola",
    price: "15",
    quantity: "10",
    barcode: "7501031311309",
    created: "2023-01-01",
    updated: "2023-01-01"
  };

  const mockVentaActualConProducto: VentaProduct[] = [{
    ...mockProductoConStock,
    quantityInSale: 1
  }];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Al escanear un producto con su código de barras este se agrega automáticamente a la venta actual si tiene stock disponible", async () => {
    let ventaActual: VentaProduct[] = [];
    
    (useVentas as jest.Mock).mockImplementation(() => ({
      filteredProducts: [],
      ventaActual,
      agregarProductoAVenta: mockAgregarProductoAVenta,
      products: [mockProductoConStock],
    }));

    const { rerender } = render(<VentasScreen />, {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(screen.getByText("Escanear Código de Barras")).toBeTruthy();
    });

    // 1. Abrir cámara
    fireEvent.press(screen.getByTestId("scan-button-ventas"));

    // 2. Verificar cámara
    await waitFor(() => {
      expect(screen.getByText("Enfoca el código de barras dentro del marco")).toBeTruthy();
    });

    // 3. Cerrar cámara
    fireEvent.press(screen.getByTestId("close-camera-button-ventas"));

    // 4. Simular escaneo
    mockAgregarProductoAVenta(mockProductoConStock);

    // 5. Actualizar estado
    ventaActual = [...mockVentaActualConProducto];
    rerender(<VentasScreen />);

    // 6. Verificaciones
    expect(mockAgregarProductoAVenta).toHaveBeenCalledWith(mockProductoConStock);

    await waitFor(() => {
      expect(screen.getByText("Coca Cola")).toBeTruthy();
      expect(screen.getByText(/\$.*15.*x.*1/)).toBeTruthy();
    });
  });
});