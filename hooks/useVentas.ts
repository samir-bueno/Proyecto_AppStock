import { mapRecordToProduct } from "@/app/(tabs)/inventario";
import { useAuth } from "@/contexts/AuthProvider";
import { getProductsByOwner, Product, VentaProduct } from "@/services/pocketbaseServices";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";

export const useVentas = () => {
    const { user} = useAuth();
    const [busqueda, setbusqueda] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [ventaActual, setVentaActual] = useState<VentaProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
  
    const agregarProductoAVenta = (producto: Product) => {
      setVentaActual((prevVenta) => {
        const productoExistente = prevVenta.find((p) => p.id === producto.id);
  
        if (productoExistente) {
          // Si el producto ya está en la venta, incrementa su cantidad
          return prevVenta.map((p) =>
            p.id === producto.id && p.quantityInSale < Number(p.quantity)
              ? { ...p, quantityInSale: p.quantityInSale + 1 }
              : p
          );
        } else {
          // Si es un producto nuevo, lo añade con cantidad 1
          return [...prevVenta, { ...producto, quantityInSale: 1 }];
        }
      });
      setbusqueda("");
      setIsSearchFocused(false);
    };
  
    const handleQuantityChange = (productId: string, amount: number) => {
      setVentaActual((prevVenta) => {
        const updatedVenta = prevVenta.map((p) =>
          p.id === productId
            ? {
                ...p,
                quantityInSale: Math.min(
                  p.quantityInSale + amount,
                  Number(p.quantity)
                ),
              }
            : p
        );
        // Filtra y elimina los productos cuya cantidad llegue a 0
        return updatedVenta.filter((p) => p.quantityInSale > 0);
      });
    };
    const loadProducts = async () => {
      if (!user) return;
      setLoading(true);
      const result = await getProductsByOwner(user.id);
      if (result.success) {
        const mappedProducts = result.data
          ? result.data
              .map(mapRecordToProduct)
              .filter((p) => Number(p.quantity) > 0)
          : [];
        setProducts(mappedProducts);
        setFilteredProducts(mappedProducts);
      } else {
        console.error(result.error);
      }
      setLoading(false);
    };
  
    useFocusEffect(
      useCallback(() => {
        loadProducts();
      }, [user])
    );
  
    useEffect(() => {
      if (busqueda === "") {
        setFilteredProducts(products);
      } else {
        const filtered = products.filter((product) =>
          product.product_name.toLowerCase().includes(busqueda.toLowerCase())
        );
        setFilteredProducts(filtered);
      }
    }, [products, busqueda]);

  return {
    // Estado
    user,
    loading,
    busqueda,
    filteredProducts,
    ventaActual,
    isSearchFocused,

    // Funciones
    agregarProductoAVenta,
    handleQuantityChange,

    // Setters para estados específicos si los necesitas
    setbusqueda,
    setIsSearchFocused,
  };
};
