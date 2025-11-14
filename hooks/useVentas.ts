import { mapRecordToProduct } from "@/app/(tabs)/inventario";
import { useAuth } from "@/contexts/AuthProvider";
import {
  Customer,
  getCustomersByOwner,
  getProductsByOwner,
  processSale,
  Product,
  updateCustomer,
  VentaProduct
} from "@/services/pocketbaseServices";
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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

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

  const loadCustomers = async () => {
    if (!user) return;
    const result = await getCustomersByOwner(user.id);
    if (result.success) {
      setCustomers(result.data || []);
    } else {
      console.error("Error cargando clientes:", result.error);
    }
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

  // Función para manejar "Venta normal"
  const handleVentaNormal = () => {
    if (ventaActual.length === 0) {
      Alert.alert("Error", "No hay productos en la venta");
      return;
    }
    setShowConfirmModal(true);
  };

  // Función para manejar "Venta Fiado"
  const handleVentaFiado = () => {
    if (ventaActual.length === 0) {
      Alert.alert("Error", "No hay productos en la venta");
      return;
    }
    loadCustomers(); // Cargar clientes antes de mostrar el modal
    setShowCustomerModal(true);
  };

  // Función para confirmar la venta normal
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

  // Función para confirmar venta fiada
  const confirmarVentaFiada = async (customer: Customer) => {
    if (!user) {
      Alert.alert("Error", "No hay usuario autenticado");
      return;
    }

    try {
      // Calcular total
      const total = ventaActual.reduce((sum, product) => {
        return sum + (product.quantityInSale * parseFloat(product.price));
      }, 0);

      // Preparar datos de la venta FIADA
      const saleData = {
        owner_id: user.id,
        total: total.toString(),
        sale_type: "fiado" as const, // ← VENTA FIADA
        customer_id: customer.id // ← Cliente específico
      };

      // Preparar items de la venta
      const saleItems = ventaActual.map(product => ({
        product_id: product.id,
        product_name: product.product_name,
        quantity: product.quantityInSale,
        unit_price: parseFloat(product.price),
        subtotal: product.quantityInSale * parseFloat(product.price)
      }));

      // Procesar la venta fiada
      const result = await processSale(saleData, saleItems);

      if (result.success) {
        // Actualizar deuda del cliente
        const nuevaDeuda = parseFloat(customer.deuda) + total;
        const updateResult = await updateCustomer(customer.id, {
          deuda: nuevaDeuda.toString()
        });

        if (updateResult.success) {
          Alert.alert("Éxito", `Venta fiada registrada para ${customer.name}`);
          setVentaActual([]); // Limpiar la venta actual
          setShowCustomerModal(false); // Cerrar modal de clientes
          await loadProducts(); // Recargar productos
        } else {
          Alert.alert("Error", "Venta registrada pero error actualizando deuda");
        }
      } else {
        Alert.alert("Error", result.error || "Error al procesar la venta fiada");
      }
    } catch (error) {
      console.error("Error en confirmarVentaFiada:", error);
      Alert.alert("Error", "No se pudo completar la venta fiada");
    }
  };

  // Función para cancelar la venta normal
  const cancelarVenta = () => {
    setShowConfirmModal(false);
  };

  // Función para cancelar selección de cliente
  const cancelarSeleccionCliente = () => {
    setShowCustomerModal(false);
    setSelectedCustomer(null);
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
    showConfirmModal,
    showCustomerModal,
    customers,
    selectedCustomer,

    // Funciones
    agregarProductoAVenta,
    handleQuantityChange,
    handleVentaNormal,
    handleVentaFiado,
    confirmarVenta,
    confirmarVentaFiada,
    cancelarVenta,
    cancelarSeleccionCliente,

    // Setters para estados específicos si los necesitas
    setbusqueda,
    setIsSearchFocused,
    setShowConfirmModal,
    setShowCustomerModal,

    agregarProductoPorCodigoBarras,
    products,
  };
};