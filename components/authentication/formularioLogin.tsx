import { ThemedText } from "@/components/ThemedText";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "expo-image";
import { Link } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";
// Define Zod schema for form validation

const schema = z.object({
  email: z
    .email({ message: "El campo 'email' debe ser un correo válido" })
    .min(1, { message: "El campo 'email' es obligatorio" }),
  contraseña: z
    .string({ message: "El campo 'contraseña' es obligatorio" })
    .min(8, {
      message: "El campo 'contraseña' debe contener al menos 8 caracteres",
    }),
});
const FormularioLogin = ({
  alGuardarLosDatosDelFormulario,
  cargando,
  errorServidor,
}: {
  alGuardarLosDatosDelFormulario: (data: z.infer<typeof schema>) => void;
  cargando: boolean;
  errorServidor: string | null;
}) => {
  // Initialize the form with React Hook Form and Zod schema resolver

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });
  const onSubmit = (data: z.infer<typeof schema>) => {
    alGuardarLosDatosDelFormulario(data);
  };
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
              {errorServidor && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{errorServidor}</Text>
                </View>
              )}

        <Image
          style={styles.image}
          source="https://artely.com.br/site/wp-content/uploads/2023/07/carrefour-logo-01-01.jpg"
          />
        </View>
      <ThemedText style={styles.modalTitle}>Iniciar sesión</ThemedText>
      <View>
        {/* Primer campo */}
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <TextInput
              style={styles.inpu}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Email"
              ref={ref}
              placeholderTextColor="#999"
            />
          )}
        />
        {errors.email && (
          <Text style={styles.error}>{errors.email.message}</Text>
        )}
        <Controller
          control={control}
          name="contraseña"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <TextInput
              style={styles.inpu}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Contraseña"
              ref={ref}
              placeholderTextColor="#999"
              secureTextEntry
            />
          )}
        />
        {errors.contraseña && (
          <Text style={styles.error}>{errors.contraseña.message}</Text>
        )}
        <TouchableOpacity
          style={[styles.modalButton, styles.saveButton]}
          onPress={handleSubmit(onSubmit)}
          disabled={cargando}
        >
          <ThemedText style={styles.saveButtonText}>
            {cargando ? "Ingresando..." : "Ingresar"}
          </ThemedText>
        </TouchableOpacity>
        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            ¿No tienes una cuenta?
          </ThemedText>
          <Link href="/(Auth)/signin" style={styles.link}>
            <ThemedText type="link">Crea una</ThemedText>
          </Link>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: { padding: 20 },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  footer: { marginTop: 20, alignItems: "center", gap: 10 },
  footerText: { color: "#333", fontSize: 16 },
  link: { paddingVertical: 10 },
  error: { color: "red" },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
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
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: { backgroundColor: "#f1f1f1" },
  saveButton: { backgroundColor: "#28a745" },
  cancelButtonText: { color: "#333", fontWeight: "bold" },
  saveButtonText: { color: "white", fontWeight: "bold" },
  image: { borderRadius: 100, width: 60, height: 60, opacity: 0.8 },
  imageContainer: { alignItems: "center", borderRadius: 100 },
    errorContainer: {
    backgroundColor: "#f8d7da",
    borderColor: "#f5c6cb",
    borderWidth: 1,
    borderRadius: 5,
    padding: 15,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  errorText: { color: "#721c24", flex: 1 },
});
export default FormularioLogin;
