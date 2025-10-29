// components/fiados/ClientListItem.tsx
import { ThemedText } from "@/components/ThemedText";
import { Customer } from "@/services/pocketbaseServices";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Collapsible from "react-native-collapsible";

interface TarjetaFiadoProps {
  item: Customer;
  isExpanded: boolean;
  onToggle: (clientId: string) => void;
  onEdit: (client: Customer) => void; 
}

const Tarjeta_fiado: React.FC<TarjetaFiadoProps> = ({
  item,
  isExpanded,
  onToggle,
  onEdit, 
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.clientItem}
        onPress={() => {
          Alert.alert(
            item.name,
            `Teléfono: ${item.phone || "No proporcionado"}`
          );
        }}
      >
        <View style={styles.clientInfo}>
          <ThemedText style={styles.clientName}>{item.name}</ThemedText>
          <ThemedText style={styles.clientPhone}>
            {item.phone || "Sin teléfono"}
          </ThemedText>
        </View>

        <ThemedText style={styles.clientDeuda}>{`$${item.deuda}`}</ThemedText>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            onEdit(item); 
          }}
          testID="boton-editar"
        >
          <MaterialCommunityIcons name="pencil" size={20} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => {
            onToggle(item.id);
          }}
          testID="boton-detalles"
        >
          <MaterialCommunityIcons 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={24} 
            color="#841584" 
          />
        </TouchableOpacity>
      </TouchableOpacity>

      <Collapsible collapsed={!isExpanded} duration={300}>
        <View style={styles.details}>
          <ThemedText>Detalles con animación fluida.</ThemedText>
          <ThemedText>Este contenido es de {item.name}.</ThemedText>
          {/* Aquí puedes agregar más detalles específicos del cliente */}
        </View>
      </Collapsible>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  clientItem: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  clientPhone: {
    fontSize: 14,
    color: "#666",
  },
  clientDeuda: {
    fontSize: 24,
    fontWeight: "normal",
    color: "green",
    marginLeft: 10,
    marginRight: 10,
  },
  editButton: {
    backgroundColor: "#ffa500",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  detailsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  details: {
    backgroundColor: "white",
    padding: 16,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
});

export default Tarjeta_fiado;