import { ThemedText } from "@/components/ThemedText";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { z } from "zod";

// Schema de validación (tomado de tu useSigninForm)
export const signupSchema = z
  .object({
    nombre: z.string("El campo 'nombre' es obligatorio").min(2, "El campo 'nombre' debe contener al menos 2 caracteres"),
    email: z
      .email("El campo 'email' debe ser un correo válido")
      .min(1, "El campo 'email' es obligatorio"),
    contraseña: z
      .string("El campo 'contraseña' es obligatorio")
      .min(8, "El campo 'contraseña' debe contener al menos 8 caracteres"),
    confirmacion: z.string("El campo 'confirmación' es obligatorio"),
  })
  .refine((data) => data.contraseña === data.confirmacion, {
    message: "Las contraseñas no coinciden",
    path: ["confirmacion"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;

const FormularioSignin = ({
  alGuardarLosDatosDelFormulario,
  cargando,
  errorServidor,
}: {
  alGuardarLosDatosDelFormulario: (data: SignupFormData) => void;
  cargando: boolean;
  errorServidor: string | undefined;
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({ resolver: zodResolver(signupSchema) });

  const onSubmit = (data: SignupFormData) => {
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
          source={require("@/assets/images/appStock.png")}
        />        
      </View>
      <ThemedText style={styles.modalTitle}>Crear Cuenta</ThemedText> 
      <View>
        {/* Campo: Nombre */}
        <Controller
          control={control}
          name="nombre"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <TextInput
              style={styles.inpu}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Nombre"
              ref={ref}
              placeholderTextColor="#999"
              autoCapitalize="words"
            />
          )}
        />
        {errors.nombre && (
          <Text style={styles.error}>{errors.nombre.message}</Text>
        )}
        {/* Campo: Email */}
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <TextInput
              style={styles.inpu}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Correo electrónico"
              ref={ref}
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />
        {errors.email && (
          <Text style={styles.error}>{errors.email.message}</Text>
        )}
        {/* Campo: Contraseña */}
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
        {/* Campo: Confirmar Contraseña */}
        <Controller
          control={control}
          name="confirmacion"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <TextInput
              style={styles.inpu}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Confirmar contraseña"
              ref={ref}
              placeholderTextColor="#999"
              secureTextEntry
            />
          )}
        />
        {errors.confirmacion && (
          <Text style={styles.error}>{errors.confirmacion.message}</Text>
        )}
        <TouchableOpacity
          style={[styles.modalButton, styles.saveButton]}
          onPress={handleSubmit(onSubmit)}
          disabled={cargando}
        >
          <ThemedText style={styles.saveButtonText}>
            {cargando ? "Creando cuenta..." : "Registrarse"}
          </ThemedText>
        </TouchableOpacity>
        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            ¿Ya tienes una cuenta?
          </ThemedText>
          <Link href="/(Auth)/login" style={styles.link}>
           <ThemedText type="link">Iniciar Sesión</ThemedText>
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

export default FormularioSignin;
