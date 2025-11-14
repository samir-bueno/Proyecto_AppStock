import VentaActual from '@/components/ventas/ventaActual';
import { AuthProvider } from '@/contexts/AuthProvider';
import { VentaProduct } from '@/services/pocketbaseServices';
import { render, screen } from '@testing-library/react-native';
import React from 'react';

const mockHandleQuantityChange = jest.fn();
const mockHandleVentaNormal = jest.fn();
const mockHandleVentaFiado = jest.fn(); // ← Nueva función agregada

describe('VentaActual - Botones de venta', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Se muestra los botones de "venta normal" y "venta fiado" una vez puesto el producto', () => {
    const mockProductosEnVenta: VentaProduct[] = [
      {
        id: '1',
        product_name: 'Laptop Gamer',
        price: '1200',
        quantity: '5',
        quantityInSale: 2,
        barcode: '123456789',
        owner_id: 'test-user-id',
        created: '2023-01-01',
        updated: '2023-01-01'
      }
    ];

    render(
      <VentaActual
        productosEnVenta={mockProductosEnVenta}
        handleQuantityChange={mockHandleQuantityChange}
        handleVentaNormal={mockHandleVentaNormal}
        handleVentaFiado={mockHandleVentaFiado} // ← Nueva prop agregada
      />,
      {wrapper: AuthProvider}
    );

    expect(screen.getByText('Laptop Gamer')).toBeTruthy();
    expect(screen.getByText(/\$.*1200.*x.*2/)).toBeTruthy();

    expect(screen.getByText('Venta Normal')).toBeTruthy();
    expect(screen.getByText('Venta Fiado')).toBeTruthy();
  });
});