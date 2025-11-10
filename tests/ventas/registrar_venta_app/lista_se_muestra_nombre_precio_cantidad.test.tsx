import VentaActual from '@/components/ventas/ventaActual';
import { AuthProvider } from '@/contexts/AuthProvider';
import { VentaProduct } from '@/services/pocketbaseServices';
import { render, screen } from '@testing-library/react-native';
import React from 'react';


const mockHandleQuantityChange = jest.fn();
const mockHandleVentaNormal = jest.fn();

describe('VentaActual - Productos en venta', () => {
 beforeEach(() => {
   jest.clearAllMocks();
 });


 test('Cada producto agregado a la venta muestra su nombre, precio y cantidad seleccionada', () => {
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
     },
     {
       id: '2',
       product_name: 'Mouse Inalámbrico',
       price: '25',
       quantity: '10',
       quantityInSale: 1,
       barcode: '987654321',
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
     />,
     {wrapper: AuthProvider}
   );


   // VERIFICACIÓN: Cada producto muestra su NOMBRE, PRECIO y CANTIDAD

  // <Text>
  //    $          {/* Símbolo moneda */}
  //   1200        {/* Precio */}
  //    x          {/* Separador */}
  //   2           {/* Cantidad */}
  // </Text>
   expect(screen.getByText('Laptop Gamer')).toBeTruthy();
   expect(screen.getByText(/\$.*1200.*x.*2/)).toBeTruthy();
   expect(screen.getByText('2')).toBeTruthy();


   expect(screen.getByText('Mouse Inalámbrico')).toBeTruthy();
   expect(screen.getByText(/\$.*25.*x.*1/)).toBeTruthy();
   expect(screen.getByText('1')).toBeTruthy();
 });
});
