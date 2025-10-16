import Header from "@/components/global/header";
import BusquedaProductos from "@/components/ventas/busqueda";
import EscanearCodigoDeBarras from "@/components/ventas/escanearCodigoDeBarras";
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
  const { busqueda, loading, filteredProducts, ventaActual, isSearchFocused, handleQuantityChange, setbusqueda, setIsSearchFocused, agregarProductoAVenta } = useVentas();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <Header />

      <FlatList
        style={styles.container}
        data={[]} // Sin datos, solo la usamos para el layout
        keyExtractor={(item, index) => index.toString()}
        renderItem={null}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <>
            <EscanearCodigoDeBarras />

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
            />
          </>
        }
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