import { styles } from "@/app/(tabs)/fiados";
import { ThemedText } from "@/components/ThemedText";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
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
  telefono: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 8, {
      message: "El campo 'telefono' debe contener al menos 8 digitos",
    }),
});

const FormuloarioParaAgregarUnFiado = ({
  alCerrarElFormulario,
  alGuardarLosDatosDelFormulario,
  agregandoCliente = false,
}: {
  alCerrarElFormulario: () => void;
  alGuardarLosDatosDelFormulario: (data: z.infer<typeof schema>) => void;
  agregandoCliente: boolean;
}) => {
  // Initialize the form with React Hook Form and Zod schema resolver
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
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
              placeholder="Nombre del cliente *"
              ref={ref}
              placeholderTextColor="#999"
            />
          )}
        />

        {/* Segundo campo */}
        <Controller
          control={control}
          name="telefono"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <TextInput
              style={styles_para_formulario.inpu}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Telefono (opcional)"
              ref={ref}
              placeholderTextColor="#999"
            />
          )}
        />
        {errors.nombre && (
          <Text style={styles_para_formulario.error}>
            El campo 'nombre' debe contener al menos dos letras
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
            disabled={agregandoCliente}
          >
             {agregandoCliente ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
            <ThemedText style={styles.saveButtonText}>Guardar</ThemedText>
          )}
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

export default FormuloarioParaAgregarUnFiado;
