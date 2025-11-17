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
    nombre: z
      .string()
      .min(2, "El campo 'nombre' debe contener al menos 2 caracteres"),
    email: z
      .string()
      .email("El campo 'email' debe ser un correo válido")
      .min(1, "El campo 'email' es obligatorio"),
    contraseña: z
      .string()
      .min(1, "El campo 'contraseña' es obligatorio")
      .min(8, "El campo 'contraseña' debe contener al menos 8 caracteres"),
    confirmacion: z.string().min(1, "El campo 'confirmación' es obligatorio"),
  })
  .refine((data) => data.contraseña === data.confirmacion, {
    message: "Las contraseñas no coinciden",
    path: ["confirmacion"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;

interface FormularioSigninProps {
  alGuardarLosDatosDelFormulario: (data: SignupFormData) => void;
  cargando: boolean;
  errorServidor: string | undefined;
}

const FormularioSignin = ({
  alGuardarLosDatosDelFormulario,
  cargando,
  errorServidor,
}: FormularioSigninProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      nombre: "",
      email: "",
      contraseña: "",
      confirmacion: "",
    },
  });

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
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Nombre"
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
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Correo electrónico"
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
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Contraseña"
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
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Confirmar contraseña"
              placeholderTextColor="#999"
              secureTextEntry
            />
          )}
        />
        {errors.confirmacion && (
          <Text style={styles.error}>{errors.confirmacion.message}</Text>
        )}

        {/* Botón de registro - SOLUCIÓN: Usar Text normal */}
        <TouchableOpacity
          style={[styles.modalButton, styles.saveButton]}
          onPress={handleSubmit(onSubmit)}
          disabled={cargando}
        >
          <Text style={styles.saveButtonText}>
            {cargando ? "Creando cuenta..." : "Registrarse"}
          </Text>
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
  container: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  footer: {
    marginTop: 20,
    alignItems: "center",
    gap: 10,
  },
  footerText: {
    color: "#333",
    fontSize: 16,
  },
  link: {
    paddingVertical: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
    fontSize: 14,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  modalButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: "#28a745",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  image: {
    borderRadius: 100,
    width: 60,
    height: 60,
    opacity: 0.8,
  },
  imageContainer: {
    alignItems: "center",
    borderRadius: 100,
    marginBottom: 20,
  },
  errorContainer: {
    backgroundColor: "#f8d7da",
    borderColor: "#f5c6cb",
    borderWidth: 1,
    borderRadius: 5,
    padding: 15,
    marginBottom: 20,
  },
  errorText: {
    color: "#721c24",
  },
});

export default FormularioSignin;
