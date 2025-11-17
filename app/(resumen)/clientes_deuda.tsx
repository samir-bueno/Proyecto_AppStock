// components/fiados/ClientesDeuda.tsx
import { CuentasDeFiado } from "@/components/fiados/cuentasDeFiado";
import ListaDeFiados from "@/components/fiados/lista_de_fiados";
import Tarjeta_fiado from "@/components/fiados/lista_de_fiados/tarjeta_fiado";
import { ThemedText } from "@/components/ThemedText";
import { useAuth } from "@/contexts/AuthProvider";
import { useFiados } from "@/hooks/useFiados";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo } from "react"; // ¡Importa useMemo!
import { SafeAreaView, StyleSheet, View } from "react-native";

export default function ClientesDeuda() {
  const { user } = useAuth();
  const { clients, expandedId, toggleDetails, openEditForm, openDeleteModal } =
    useFiados();

  // Ordenar clientes por deuda (mayor a menor)
  const sortedClients = useMemo(() => {
    if (!clients || clients.length === 0) return [];

    return [...clients].sort((a, b) => {
      // Convertir deudas a números si son strings
      const deudaA =
        typeof a.deuda === "string"
          ? parseFloat(a.deuda.replace("$", "")) || 0
          : a.deuda || 0;

      const deudaB =
        typeof b.deuda === "string"
          ? parseFloat(b.deuda.replace("$", "")) || 0
          : b.deuda || 0;

      return deudaB - deudaA; // Orden descendente (mayor a menor)
    });
  }, [clients]); // Se recalcula solo cuando clients cambia

  useEffect(() => {
    sortedClients;
  }, [user]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={["#0000FF", "#3399FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View>
          <ThemedText style={styles.headerTitle}>AppStock</ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Bienvenido, {user?.name}
          </ThemedText>
        </View>
      </LinearGradient>

      <CuentasDeFiado />

      <ListaDeFiados
        clients={sortedClients}
        renderizarClientes={({ item }) => (
          <Tarjeta_fiado
            item={item}
            isExpanded={expandedId === item.id}
            isFiadosScreen={false}
            onToggle={toggleDetails}
            onEdit={() => openEditForm(item)}
            onDelete={() => openDeleteModal(item)}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f4f5f7",
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "white",
    opacity: 0.9,
  },
});
