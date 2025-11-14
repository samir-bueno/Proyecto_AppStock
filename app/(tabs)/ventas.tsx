import Header from "@/components/global/header";
import BusquedaProductos from "@/components/ventas/busqueda";
import ConfirmSaleModal from "@/components/ventas/ConfirmSaleModal";
import EscanearCodigoDeBarras from "@/components/ventas/escanearCodigoDeBarras";
import SelectCustomerModal from "@/components/ventas/SelectCustomerModal"; // ← Nuevo import
import VentaActual from "@/components/ventas/ventaActual";
import { useVentas } from "@/hooks/useVentas";
import React from "react";
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet
} from "react-native";
import "react-native-gesture-handler";

export default function HomeScreen() {
  const { 
    busqueda, 
    loading, 
    filteredProducts, 
    ventaActual, 
    isSearchFocused, 
    showConfirmModal,
    showCustomerModal, // ← Nuevo estado
    customers, // ← Nuevo estado
    handleQuantityChange, 
    handleVentaNormal,
    handleVentaFiado, // ← Nueva función
    confirmarVenta,
    confirmarVentaFiada, // ← Nueva función
    cancelarVenta,
    cancelarSeleccionCliente, // ← Nueva función
    setbusqueda, 
    setIsSearchFocused, 
    agregarProductoAVenta,
    products
  } = useVentas();

  // Calcular el total para los modales
  const totalVenta = ventaActual.reduce((sum, product) => {
    return sum + (product.quantityInSale * parseFloat(product.price));
  }, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <Header />

      <FlatList
        style={styles.container}
        data={[]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={null}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <>
            <EscanearCodigoDeBarras
              onProductoEscaneado={agregarProductoAVenta}
              productos={products}
            />

            <BusquedaProductos
              agregarProducto={agregarProductoAVenta}
              valorBusqueda={busqueda}
              setValorBusqueda={setbusqueda}
              elBuscadorSeMuestra={isSearchFocused}
              setElBuscadorSeMuestra={setIsSearchFocused}
              filtrarProductos={filteredProducts}
              cargando={loading}
            />

            <VentaActual
              productosEnVenta={ventaActual}
              handleQuantityChange={handleQuantityChange}
              handleVentaNormal={handleVentaNormal}
              handleVentaFiado={handleVentaFiado} // ← Nueva prop
            />
          </>
        }
      />

      {/* Modal de confirmación para venta normal */}
      <ConfirmSaleModal
        visible={showConfirmModal}
        onClose={cancelarVenta}
        onConfirm={confirmarVenta}
        products={ventaActual}
        total={totalVenta}
      />

      {/* Modal de selección de cliente para venta fiada */}
      <SelectCustomerModal
        visible={showCustomerModal}
        onClose={cancelarSeleccionCliente}
        onConfirm={confirmarVentaFiada}
        customers={customers}
        total={totalVenta}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f4f5f7",
  },
  container: {
    padding: 20,
  }
});