import { styles } from "@/app/(tabs)/fiados";
import { ThemedText } from "@/components/ThemedText";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { z } from "zod";

// Define Zod schema for form validation
const schema = z.object({
  nombre: z
    .string()
    .min(2, { message: "El campo 'nombre' debe contener al menos dos letras" }),
  cantidad: z
    .string()
    .min(1, { message: "El campo 'cantidad' es obligatorio" }),
  precio: z
    .string()
    .min(1, { message: "El campo 'precio' es obligatorio" }),
  codigo_barras: z
    .string()
    .optional(),
});

const FormularioParaAgregarUnProducto = ({
  alCerrarElFormulario,
  alGuardarLosDatosDelFormulario,
  agregandoProducto = false,
  productoExistente,
}: {
  alCerrarElFormulario: () => void;
  alGuardarLosDatosDelFormulario: (data: z.infer<typeof schema>) => void;
  agregandoProducto: boolean;
  productoExistente?: { producto: string; cantidad: string; precio: string, codigo_barras?: string };
}) => {
  // Initialize the form with React Hook Form and Zod schema resolver
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: productoExistente
      ? {
          nombre: productoExistente.producto || '',
          cantidad: productoExistente.cantidad || '',
          precio: productoExistente.precio || '',
          codigo_barras: productoExistente.codigo_barras || '',
        }
      : {},
  });

  // Function to handle form submission
  const onSubmit = (data: z.infer<typeof schema>) => {
    // Llamamos al callback del padre pasando los datos del formulario
    alGuardarLosDatosDelFormulario(data);
    console.log("Formulario enviado:", data);
  };

  const onClose = () => {
    alCerrarElFormulario()
  }

  return (
    <View>
      <ThemedText style={styles_para_formulario.modalTitle}>
        Agregar Nuevo Cliente
      </ThemedText>

      <View>
        {/* Primer campo */}
        <Controller
          control={control}
          name="nombre"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <TextInput
              style={styles_para_formulario.inpu}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
                placeholder="Nombre del producto *"
              ref={ref}
              placeholderTextColor="#999"
            />
          )}
        />

        {/* Segundo campo */}
        <Controller
          control={control}
          name="cantidad"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <TextInput
              style={styles_para_formulario.inpu}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Cantidad *"
              ref={ref}
              placeholderTextColor="#999"
            />
          )}
        />
        {/* Tercer campo */}
        <Controller
          control={control}
          name="precio"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <TextInput
              style={styles_para_formulario.inpu}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Precio *"
              ref={ref}
              placeholderTextColor="#999"
            />
          )}
        />
        {/* Cuarto campo */}
        <Controller
          control={control}
          name="codigo_barras"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <TextInput
              style={styles_para_formulario.inpu}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Codigo de barras (opcional)"
              ref={ref}
              placeholderTextColor="#999"
            />
          )}
        />
        {errors.nombre && (
          <Text style={styles_para_formulario.error}>
            El campo 'nombre' debe contener al menos dos letras
          </Text>
        ) || errors.cantidad && (
          <Text style={styles_para_formulario.error}>
            El campo 'cantidad' es obligatorio
          </Text>
        ) || errors.precio && (
          <Text style={styles_para_formulario.error}>
            El campo 'precio' es obligatorio
          </Text>
        )}
        
        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={onClose}
          >
            <ThemedText style={styles.cancelButtonText}>Cancelar</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalButton, styles.saveButton]}
            onPress={handleSubmit(onSubmit)}
          >
            
            <ThemedText style={styles.saveButtonText}>Guardar</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles_para_formulario = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  error: {
    color: "red",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxWidth: 400,
  },
  inpu: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
});

export default FormularioParaAgregarUnProducto;
