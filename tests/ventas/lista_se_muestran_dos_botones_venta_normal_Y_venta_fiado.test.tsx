import React from 'react';
import { render, screen } from '@testing-library/react-native';
import VentaActual from '@/components/ventas/ventaActual';
import { VentaProduct } from '@/services/pocketbaseServices';

const mockHandleQuantityChange = jest.fn();

describe('VentaActual - Botones de venta', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Se muestra debajo de todo los botones de "venta normal" y "venta fiado"', () => {
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
      />
    );

    expect(screen.getByText('Venta Normal')).toBeTruthy();
    expect(screen.getByText('Venta Fiado')).toBeTruthy();
  });
});