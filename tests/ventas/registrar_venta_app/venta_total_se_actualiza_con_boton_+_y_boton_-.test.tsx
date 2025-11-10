import VentaActual from '@/components/ventas/ventaActual';
import { AuthProvider } from '@/contexts/AuthProvider';
import { VentaProduct } from '@/services/pocketbaseServices';
import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';

const mockHandleQuantityChange = jest.fn();
const mockHandleVentaNormal = jest.fn(); // Cambiado aquí

describe('VentaActual - Actualización del total', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('El total de la venta se actualiza automáticamente al AUMENTAR cantidades con el botón +', () => {
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
        handleVentaNormal={mockHandleVentaNormal} // Cambiado aquí
      />,
      {wrapper: AuthProvider}
    );

    // Verificar el total INICIAL (2 laptops x $1200 = $2400)
    expect(screen.getByTestId("total-value")).toHaveTextContent("$2400");

    const botonMas = screen.getByText('+');
    fireEvent.press(botonMas);

    // Verificar que se llamó a handleQuantityChange con +1
    expect(mockHandleQuantityChange).toHaveBeenCalledWith('1', 1);

    const productosActualizados: VentaProduct[] = [
      {
        ...mockProductosEnVenta[0],
        quantityInSale: 3 // Cantidad aumentada a 3
      }
    ];

    render(
      <VentaActual
        productosEnVenta={productosActualizados}
        handleQuantityChange={mockHandleQuantityChange}
        handleVentaNormal={mockHandleVentaNormal} // Cambiado aquí
      />,
      {wrapper: AuthProvider}
    );

    // Verificar que el total se ACTUALIZÓ (3 laptops x $1200 = $3600)
    expect(screen.getByTestId("total-value")).toHaveTextContent("$3600");
    expect(screen.getByText('3')).toBeTruthy();
  });

  test('El total de la venta se actualiza automáticamente al DISMINUIR cantidades con el botón -', () => {
    const mockProductosEnVenta: VentaProduct[] = [
      {
        id: '1',
        product_name: 'Laptop Gamer',
        price: '1200',
        quantity: '5',
        quantityInSale: 3, // Cantidad inicial: 3
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
        handleVentaNormal={mockHandleVentaNormal} // Cambiado aquí
      />,
      {wrapper: AuthProvider}
    );

    // Verificar el total INICIAL (3 laptops x $1200 = $3600)
    expect(screen.getByTestId("total-value")).toHaveTextContent("$3600");

    const botonMenos = screen.getByText('-');
    fireEvent.press(botonMenos);

    // Verificar que se llamó a handleQuantityChange con -1
    expect(mockHandleQuantityChange).toHaveBeenCalledWith('1', -1);

    const productosActualizados: VentaProduct[] = [
      {
        ...mockProductosEnVenta[0],
        quantityInSale: 2 // Cantidad disminuida a 2
      }
    ];

    render(
      <VentaActual
        productosEnVenta={productosActualizados}
        handleQuantityChange={mockHandleQuantityChange}
        handleVentaNormal={mockHandleVentaNormal} // Cambiado aquí
      />,
      {wrapper: AuthProvider}
    );

    expect(screen.getByTestId("total-value")).toHaveTextContent("$2400");
    expect(screen.getByText('2')).toBeTruthy();
  });
});