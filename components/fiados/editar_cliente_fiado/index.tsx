// components/fiados/editar_cliente_fiado/formulario_para_editar_cliente.tsx
import { ThemedText } from "@/components/ThemedText";
import { Customer } from "@/services/pocketbaseServices";
import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  alCerrarElFormulario: () => void;
  alGuardarLosDatosDelFormulario: (data: { nombre: string; telefono?: string }) => void;
  editandoCliente: boolean;
  clienteExistente?: Customer | null;
}

const FormularioParaEditarCliente: React.FC<Props> = ({
  alCerrarElFormulario,
  alGuardarLosDatosDelFormulario,
  editandoCliente,
  clienteExistente,
}) => {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");

  // Pre-llenar los campos cuando el clienteExistente cambie
  useEffect(() => {
    if (clienteExistente) {
      setNombre(clienteExistente.name || "");
      setTelefono(clienteExistente.phone ? clienteExistente.phone.toString() : "");
    }
  }, [clienteExistente]);

  const handleGuardar = () => {
    if (!nombre.trim()) {
      Alert.alert("Error", "El nombre es obligatorio");
      return;
    }

    const telefonoLimpio = telefono ? telefono.trim() : "";
    
    alGuardarLosDatosDelFormulario({
      nombre: nombre.trim(),
      telefono: telefonoLimpio || undefined, // Si está vacío, envía undefined
    });
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.titulo}>Editar Cliente</ThemedText>

      <TextInput
        style={styles.input}
        placeholder="Nombre del cliente *"
        value={nombre}
        onChangeText={setNombre}
        editable={!editandoCliente}
      />

      <TextInput
        style={styles.input}
        placeholder="Teléfono (opcional)"
        value={telefono}
        onChangeText={setTelefono}
        keyboardType="phone-pad"
        editable={!editandoCliente}
      />

      <View style={styles.botonesContainer}>
        <TouchableOpacity
          style={[styles.boton, styles.botonCancelar]}
          onPress={alCerrarElFormulario}
          disabled={editandoCliente}
        >
          <ThemedText style={styles.textoBotonCancelar}>Cancelar</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.boton, styles.botonGuardar]}
          onPress={handleGuardar}
          disabled={editandoCliente}
        >
          {editandoCliente ? (
            <ThemedText style={styles.textoBotonGuardar}>Guardando...</ThemedText>
          ) : (
            <ThemedText style={styles.textoBotonGuardar}>Guardar</ThemedText>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "white",
  },
  botonesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  boton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  botonCancelar: {
    backgroundColor: "#f1f1f1",
  },
  botonGuardar: {
    backgroundColor: "#4a00e0",
  },
  textoBotonCancelar: {
    color: "#333",
    fontWeight: "bold",
  },
  textoBotonGuardar: {
    color: "white",
    fontWeight: "bold",
  },
});

export default FormularioParaEditarCliente;