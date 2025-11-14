import Header from "@/components/global/header";
import { ThemedText } from "@/components/ThemedText";
import { useAuth } from "@/contexts/AuthProvider";
import {
  getProductsDisponibleByOwner,
  getProductsPorAgotarse,
  getTotalCustomerDebt,
  getTotalGain,
} from "@/services/pocketbaseServices";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Resumen() {
 const { user } = useAuth();
 const { push } = useRouter();
 const [totalDebt, setTotalDebt] = useState<Number | 0>();
 const [totalGain, setTotalGain] = useState<Number | 0>();
 const [totalProducts, setTotalProducts] = useState<Number | 0>();
 const [totalProductsOut, setTotalProductsOut] = useState<Number | 0>();
 const [loading, setLoading] = useState(true);
 const isAlert = true;


const loadAllData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const [
        debtResult,
        gainResult,
        productsResult,
        productsOutResult,
      ] = await Promise.all([
        getTotalCustomerDebt(user.id),
        getTotalGain(user.id),
        getProductsDisponibleByOwner(user.id),
        getProductsPorAgotarse(user.id),
      ]);

      // Manejo de Deuda
      if (debtResult.success) {
        setTotalDebt(debtResult.data);
      } else {
        console.error("Error al cargar deuda:", debtResult.error);
      }

      if (gainResult.success) {
        setTotalGain(gainResult.data);
      } else {
        console.error("Error al cargar ganancia:", gainResult.error);
      }

      if (productsResult.success) {
        setTotalProducts(productsResult.data?.length || 0);
      } else {
        console.error("Error al cargar productos disponibles:", productsResult.error);
        Alert.alert("Error", productsResult.error);
      }

      if (productsOutResult.success) {
        setTotalProductsOut(productsOutResult.data?.length || 0);
      } else {
        console.error("Error al cargar productos por agotarse:", productsOutResult.error);
        Alert.alert("Error", productsOutResult.error);
      }
    } catch (error) {
      console.error("Error general al cargar datos de resumen:", error);
      Alert.alert("Error", "No se pudieron cargar todos los datos.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadAllData();

      return () => {
      };
    }, [user]) 
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#333" />
        <ThemedText>Cargando datos...</ThemedText>
      </SafeAreaView>
    );
  }

 return (
   <SafeAreaView style={styles.safeArea}>
     <Header />


     <View style={styles.container}>
       {/* Tarjeta de título */}
       <View style={styles.cardContent}>
         <View style={styles.cardHeader}>
           <MaterialCommunityIcons
             name="account-cash"
             size={24}
             color="#333"
           />
           <ThemedText style={styles.cardTitle}>Resumen</ThemedText>
         </View>
         <ThemedText style={styles.cardSubtitle}>
           Aqui encontraras toda la informacion de tus ventas y clientes
         </ThemedText>
       </View>


       {/* Contenedor principal para la cuadrícula */}
       <View style={styles.gridContainer}>
         {/* Primera Fila */}
         <View style={[styles.card]}>
           {/* Icono */}
           <MaterialCommunityIcons
             name={"credit-card-outline"}
             size={36}
             color={"green"} // Color del icono
             style={styles.icon}
           />


           {/* Valor */}
           <Text style={[styles.value]} testID="Valor-ganancia">
             ${String(totalGain) || "0"}
           </Text>


           {/* Etiqueta */}
           <Text style={styles.label} numberOfLines={2}>
             Ganancias
           </Text>
         </View>


         {/* segunda Fila */}
         <View style={[styles.card, isAlert && styles.alertCard]}>
           {/* Icono */}
           <MaterialCommunityIcons
             name={"package-variant-closed"}
             size={36}
             color={isAlert ? "#FF6347" : "#000"} // Color del icono
             style={styles.icon}
           />


           {/* Valor */}
           <Text
             style={[styles.value, isAlert && styles.alertValue]}
             testID="Valor-productos-disponibles"
           >
             {String(totalProducts) || "0"}
           </Text>


           {/* Etiqueta */}
           <Text style={styles.label} numberOfLines={2}>
             Productos disponibles
           </Text>
         </View>


         {/* tercera Fila */}
         <TouchableOpacity onPress={() => push("/(resumen)/clientes_deuda")}  style={[styles.card, isAlert && styles.alertCard]}>
           {/* Icono */}
           <MaterialCommunityIcons
             name={"account-cash"}
             size={36}
             color={isAlert ? "#FF6347" : "#000"} // Color del icono
             style={styles.icon}
           />


           {/* Valor */}
           <Text
             style={[styles.value, isAlert && styles.alertValue]}
             testID="Valor-deuda-clientes"
           >
             ${String(totalDebt) || "0"}
           </Text>


           {/* Etiqueta */}
           <Text style={styles.label} numberOfLines={2}>
             Deuda de clientes
           </Text>
         </TouchableOpacity>


         {/* cuarta Fila */}
         <View style={[styles.card, isAlert && styles.alertCard]}>
           {/* Icono */}
           <MaterialCommunityIcons
             name={"alert-octagon-outline"}
             size={36}
             color={isAlert ? "#FF6347" : "#000"} // Color del icono
             style={styles.icon}
           />


           {/* Valor */}
           <Text
             style={[styles.value, isAlert && styles.alertValue]}
             testID="Valor-productos-por-agotarse"
           >
             {String(totalProductsOut)}
           </Text>


           {/* Etiqueta */}
           <Text style={styles.label} numberOfLines={2}>
             Productos por agotarse
           </Text>
         </View>
       </View>
     </View>
   </SafeAreaView>
 );
}


const styles = StyleSheet.create({
 safeArea: {
   flex: 1,
   backgroundColor: "#f4f5f7",
 },
 container: {
   flex: 1,
   padding: 20,
 },
 contentContainer: {
   flex: 1,
   justifyContent: "center",
   alignItems: "center",
   backgroundColor: "white",
   borderRadius: 12,
   marginBottom: "10%",
   shadowColor: "#000",
   shadowOffset: { width: 0, height: 2 },
   shadowOpacity: 0.1,
   shadowRadius: 3.84,
   elevation: 5,
 },
 gridContainer: {
   flex: 1,
   flexDirection: "row",
   flexWrap: "wrap",
   justifyContent: "space-between",
   alignContent: "space-between",
   paddingVertical: "5%",
 },
 card: {
   width: "48%", // 48% para dejar espacio entre las tarjetas
   height: "48%", // 48% de altura para mantener relación cuadrada
   backgroundColor: "#fff",
   borderRadius: 8,
   padding: 15,
   alignItems: "center",
   justifyContent: "center",
   shadowColor: "#000",
   shadowOffset: { width: 0, height: 1 },
   shadowOpacity: 0.2,
   shadowRadius: 1.41,
   elevation: 2,
 },
 cardHeader: {
   flexDirection: "row",
   alignItems: "center",
   marginBottom: 10,
 },
 cardTitle: {
   fontSize: 18,
   fontWeight: "600",
   marginLeft: 10,
   color: "#333",
 },
 cardSubtitle: {
   fontSize: 14,
   color: "#666",
   marginLeft: 34,
 },
 cardContent: {
   backgroundColor: "white",
   borderRadius: 12,
   padding: 20,
   marginBottom: 20,
   shadowColor: "#000",
   shadowOffset: { width: 0, height: 2 },
   shadowOpacity: 0.1,
   shadowRadius: 3.84,
   elevation: 5,
 },
 alertCard: {
   borderColor: "#FF6347",
   borderWidth: 1,
 },
 icon: {
   marginBottom: 10,
 },
 value: {
   fontSize: 24,
   fontWeight: "bold",
   textAlign: "center",
 },
 alertValue: {
   color: "#FF6347",
 },
 label: {
   fontSize: 12,
   color: "#666",
   textAlign: "center",
   marginTop: 5,
 },
});


