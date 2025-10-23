import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useSigninForm } from "@/hooks/useSigninForm";
import { Link } from "expo-router";
import React from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";

export default function SigninForm() {
  const { formData, loading, errors, handleFieldChange, handleCrearCuenta } =
    useSigninForm();

  const getInputStyle = (field: keyof typeof errors) => {
    return errors[field] ? [styles.input, styles.inputError] : styles.input;
  };

  return (
    <View style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Crear Cuenta
      </ThemedText>

      {errors.general && (
        <ThemedView style={styles.generalError}>
          <ThemedText style={styles.generalErrorText}>
            {errors.general}
          </ThemedText>
        </ThemedView>
      )}

      <View>
        <TextInput
          style={getInputStyle("nombre")}
          placeholder="Nombre"
          value={formData.nombre}
          onChangeText={(value) => handleFieldChange("nombre", value)}
          autoCapitalize="words"
        />
        {errors.nombre && (
          <ThemedText style={styles.errorText}>{errors.nombre}</ThemedText>
        )}
      </View>

      <View>
        <TextInput
          style={getInputStyle("email")}
          placeholder="Correo electrónico"
          value={formData.email}
          onChangeText={(value) => handleFieldChange("email", value)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && (
          <ThemedText style={styles.errorText}>{errors.email}</ThemedText>
        )}
      </View>

      <View>
        <TextInput
          style={getInputStyle("contraseña")}
          placeholder="Contraseña"
          value={formData.contraseña}
          onChangeText={(value) => handleFieldChange("contraseña", value)}
          secureTextEntry
        />
        {errors.contraseña && (
          <ThemedText style={styles.errorText}>{errors.contraseña}</ThemedText>
        )}
      </View>

      <View>
        <TextInput
          style={getInputStyle("confirmacion")}
          placeholder="Confirmar contraseña"
          value={formData.confirmacion}
          onChangeText={(value) => handleFieldChange("confirmacion", value)}
          secureTextEntry
        />
        {errors.confirmacion && (
          <ThemedText style={styles.errorText}>
            {errors.confirmacion}
          </ThemedText>
        )}
      </View>

      <Button
        title={loading ? "Creando cuenta..." : "Registrarse"}
        onPress={handleCrearCuenta}
        disabled={loading}
      />

      <ThemedView style={styles.footer}>
        <ThemedText>¿Ya tienes una cuenta?</ThemedText>
        <Link href="/(Auth)/login" style={styles.link}>
          <ThemedText type="link">Iniciar Sesión</ThemedText>
        </Link>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  inputError: {
    borderColor: "#ff3b30",
    borderWidth: 1,
  },
  errorText: {
    color: "#ff3b30",
    fontSize: 12,
    marginBottom: 12,
    marginLeft: 4,
  },
  generalError: {
    backgroundColor: "#ffebee",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#ff3b30",
  },
  generalErrorText: {
    color: "#ff3b30",
    fontSize: 14,
  },
  footer: {
    marginTop: 20,
    alignItems: "center",
    gap: 10,
  },
  link: {
    paddingVertical: 10,
  },
});
