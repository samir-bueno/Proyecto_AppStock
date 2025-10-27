
import Header from "@/components/global/header";
import { ThemedText } from "@/components/ThemedText";
import { useAuth } from "@/contexts/AuthProvider";
import { getTotalCustomerDebt } from "@/services/pocketbaseServices";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function Resumen() {
  const { user } = useAuth();
  const [totalDebt, setTotalDebt] = useState();
  const [loading, setLoading] = useState(true);
  const isAlert = true;
  const value = "$5000";
  const label = "Ganancia";

  const loadTotalDebt = async () => {
    if (!user) return;
          setLoading(true);
          const result = await getTotalCustomerDebt(user.id);
          if (result.success) {
            const setTotalDebt = result.data
          } else {
            console.error(result.error);
          }
          setLoading(false);
  };

  useEffect(() => {
    loadTotalDebt();
  }, [user]);

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
            <Text style={[styles.value]}>{value}</Text>

            {/* Etiqueta */}
            <Text style={styles.label} numberOfLines={2}>
              {label}
            </Text>
          </View>

          {/* segunda Fila */}
          <View style={[styles.card, isAlert && styles.alertCard]}>
            {/* Icono */}
            <MaterialCommunityIcons
              name={"cash"}
              size={36}
              color={isAlert ? "#FF6347" : "#000"} // Color del icono
              style={styles.icon}
            />

            {/* Valor */}
            <Text style={[styles.value, isAlert && styles.alertValue]}>
              {value}
            </Text>

            {/* Etiqueta */}
            <Text style={styles.label} numberOfLines={2}>
              {label}
            </Text>
          </View>

          {/* tercera Fila */}
          <View style={[styles.card, isAlert && styles.alertCard]}>
            {/* Icono */}
            <MaterialCommunityIcons
              name={"account-cash"}
              size={36}
              color={isAlert ? "#FF6347" : "#000"} // Color del icono
              style={styles.icon}
            />

            {/* Valor */}
            <Text style={[styles.value, isAlert && styles.alertValue]}>
              {totalDebt}
            </Text>

            {/* Etiqueta */}
            <Text style={styles.label} numberOfLines={2}>
              {label}
            </Text>
          </View>

          {/* cuarta Fila */}
          <View style={[styles.card, isAlert && styles.alertCard]}>
            {/* Icono */}
            <MaterialCommunityIcons
              name={"cash"}
              size={36}
              color={isAlert ? "#FF6347" : "#000"} // Color del icono
              style={styles.icon}
            />

            {/* Valor */}
            <Text style={[styles.value, isAlert && styles.alertValue]}>
              {value}
            </Text>

            {/* Etiqueta */}
            <Text style={styles.label} numberOfLines={2}>
              {label}
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

