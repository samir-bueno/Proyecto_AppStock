import { ThemedText } from "@/components/ThemedText";
import { Customer } from "@/services/pocketbaseServices";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { FlatList, ListRenderItem, StyleSheet, View } from "react-native";

type Props = {
  clients: Customer[];
  renderizarClientes: ListRenderItem<Customer>;
};

const ListaDeFiados: React.FC<Props> = ({
  clients = [],
  renderizarClientes,
}) => {
  return (
    <>
      {/* Lista de clientes */}
      {clients.length > 0 ? (
        <FlatList
          data={clients}
          renderItem={renderizarClientes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons
            name="package-variant"
            size={50}
            color="#ccc"
          />
          <ThemedText style={styles.emptyStateText}>
            No tienes clientes registrados
          </ThemedText>
        </View>
      )}
    </>
  );
};

export default ListaDeFiados;

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 80,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
    textAlign: "center",
  },
});
