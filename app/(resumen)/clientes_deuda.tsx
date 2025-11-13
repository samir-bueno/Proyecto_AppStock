// components/fiados/ClientesDeuda.tsx
import { CuentasDeFiado } from "@/components/fiados/cuentasDeFiado";
import ListaDeFiados from "@/components/fiados/lista_de_fiados";
import Tarjeta_fiado from "@/components/fiados/lista_de_fiados/tarjeta_fiado";
import { useAuth } from "@/contexts/AuthProvider";
import { useFiados } from "@/hooks/useFiados";
import { useEffect, useMemo } from "react"; // ¡Importa useMemo!
import { SafeAreaView, StyleSheet } from "react-native";

export default function ClientesDeuda() {
  const { user } = useAuth();
  const { clients, expandedId, toggleDetails, openEditForm, openDeleteModal } = useFiados();

  // Ordenar clientes por deuda (mayor a menor)
  const sortedClients = useMemo(() => {
    if (!clients || clients.length === 0) return [];
    
    return [...clients].sort((a, b) => {
      // Convertir deudas a números si son strings
      const deudaA = typeof a.deuda === 'string' 
        ? parseFloat(a.deuda.replace('$', '')) || 0 
        : a.deuda || 0;
      
      const deudaB = typeof b.deuda === 'string' 
        ? parseFloat(b.deuda.replace('$', '')) || 0 
        : b.deuda || 0;
      
      return deudaB - deudaA; // Orden descendente (mayor a menor)
    });
  }, [clients]); // Se recalcula solo cuando clients cambia

  useEffect(() => {
    // tu código existente
  }, [user]);

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
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
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f4f5f7",
  },
});