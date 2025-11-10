import { mapRecordToProduct } from "@/app/(tabs)/inventario";
import { useAuth } from "@/contexts/AuthProvider";
import { getProductsByOwner, processSale, Product, VentaProduct } from "@/services/pocketbaseServices";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

export const useVentas = () => {
  const { user } = useAuth();
  const [busqueda, setbusqueda] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [ventaActual, setVentaActual] = useState<VentaProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Nuevo estado para el modal

  const agregarProductoAVenta = (producto: Product) => {
    setVentaActual((prevVenta) => {
      const productoExistente = prevVenta.find((p) => p.id === producto.id);
      
      if (productoExistente) {
        return prevVenta.map((p) =>
          p.id === producto.id && p.quantityInSale < Number(p.quantity)
            ? { ...p, quantityInSale: p.quantityInSale + 1 }
            : p
        );
      } else {
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

  const agregarProductoPorCodigoBarras = (codigoBarras: string) => {
    const productoEncontrado = products.find(
      producto => producto.barcode === codigoBarras
    );

    if (productoEncontrado) {
      if (Number(productoEncontrado.quantity) > 0) {
        agregarProductoAVenta(productoEncontrado);
        return { success: true, producto: productoEncontrado };
      } else {
        return {
          success: false,
          error: `El producto "${productoEncontrado.product_name}" no tiene stock disponible.`
        };
      }
    } else {
      return {
        success: false,
        error: `No se encontró ningún producto con el código: ${codigoBarras}`
      };
    }
  };

  // Nueva función para manejar "Venta normal"
  const handleVentaNormal = () => {
    if (ventaActual.length === 0) {
      Alert.alert("Error", "No hay productos en la venta");
      return;
    }
    setShowConfirmModal(true);
  };

  // Función para confirmar la venta (se ejecuta cuando presionan Confirmar en el modal)
  const confirmarVenta = async () => {
    if (!user) {
      Alert.alert("Error", "No hay usuario autenticado");
      return;
    }

    if (ventaActual.length === 0) {
      Alert.alert("Error", "No hay productos en la venta");
      return;
    }

    try {
      // Calcular total
      const total = ventaActual.reduce((sum, product) => {
        return sum + (product.quantityInSale * parseFloat(product.price));
      }, 0);

      // Preparar datos de la venta
      const saleData = {
        owner_id: user.id,
        total: total.toString(),
        sale_type: "normal" as const,
        customer_id: undefined // Venta normal, sin cliente
      };

      // Preparar items de la venta
      const saleItems = ventaActual.map(product => ({
        product_id: product.id,
        product_name: product.product_name,
        quantity: product.quantityInSale,
        unit_price: parseFloat(product.price),
        subtotal: product.quantityInSale * parseFloat(product.price)
      }));

      // Procesar la venta completa (crear venta, items y actualizar stock)
      const result = await processSale(saleData, saleItems);

      if (result.success) {
        Alert.alert("Éxito", "Venta realizada correctamente");
        setVentaActual([]); // Limpiar la venta actual
        setShowConfirmModal(false); // Cerrar el modal
        await loadProducts(); // Recargar productos para actualizar stock
      } else {
        Alert.alert("Error", result.error || "Error al procesar la venta");
      }
    } catch (error) {
      console.error("Error en confirmarVenta:", error);
      Alert.alert("Error", "No se pudo completar la venta");
    }
  };

  // Función para cancelar la venta (se ejecuta cuando presionan Cancelar en el modal)
  const cancelarVenta = () => {
    setShowConfirmModal(false);
    // No se limpia la venta actual, solo se cierra el modal
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
    showConfirmModal, // Nuevo estado

    // Funciones
    agregarProductoAVenta,
    handleQuantityChange,
    handleVentaNormal, // Reemplaza handleVendido
    confirmarVenta, // Nueva función
    cancelarVenta, // Nueva función

    // Setters para estados específicos si los necesitas
    setbusqueda,
    setIsSearchFocused,
    setShowConfirmModal, // Nuevo setter

    agregarProductoPorCodigoBarras,
    products,
  };
};