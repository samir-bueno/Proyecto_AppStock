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
    .string()
    .email({ message: "El campo 'email' debe ser un correo válido" })
    .min(1, { message: "El campo 'email' es obligatorio" }),
  contraseña: z
    .string()
    .min(1, { message: "El campo 'contraseña' es obligatorio" })
    .min(8, {
      message: "El campo 'contraseña' debe contener al menos 8 caracteres",
    }),
});

// Define the props interface
interface FormularioLoginProps {
  alGuardarLosDatosDelFormulario: (data: z.infer<typeof schema>) => void;
  cargando: boolean;
  errorServidor: string | null;
}

const FormularioLogin = ({
  alGuardarLosDatosDelFormulario,
  cargando,
  errorServidor,
}: FormularioLoginProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      contraseña: "",
    },
  });

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
          source={require("@/assets/images/appStock.png")}
        />
      </View>
      <ThemedText style={styles.modalTitle}>Iniciar sesión</ThemedText>
      <View>
        {/* Campo Email */}
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />
        {errors.email && (
          <Text style={styles.error}>{errors.email.message}</Text>
        )}

        {/* Campo Contraseña */}
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

        {/* Botón de ingreso - SOLUCIÓN: Usar Text normal */}
        <TouchableOpacity
          style={[styles.modalButton, styles.saveButton]}
          onPress={handleSubmit(onSubmit)}
          disabled={cargando}
        >
          <Text style={styles.saveButtonText}>
            {cargando ? "Ingresando..." : "Ingresar"}
          </Text>
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

export default FormularioLogin;
