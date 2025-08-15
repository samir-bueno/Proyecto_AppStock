import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { registerUser } from "@/services/pocketBaseService";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, StyleSheet, TextInput, View } from "react-native";

export default function SigninForm() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCrearCuenta = async () => {
    if (!nombre || !email || !contraseña || !confirmacion) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }
    if (contraseña !== confirmacion) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    const { success, error } = await registerUser({
      name: nombre,
      email,
      password: contraseña,
      passwordConfirm: confirmacion,
    });

    if (success) {
      Alert.alert("¡Éxito!", "Cuenta creada. Verifica tu correo.");
      router.push("/(tabs)/(Auth)/login");
    } else {
      Alert.alert("Error", error || "Error al crear la cuenta");
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <ThemedText type="title" style={styles.title}>Crear Cuenta</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={contraseña}
        onChangeText={setContraseña}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña"
        value={confirmacion}
        onChangeText={setConfirmacion}
        secureTextEntry
      />
      <Button
        title={loading ? "Creando cuenta..." : "Registrarse"}
        onPress={handleCrearCuenta}
        disabled={loading}
      />
      <ThemedView style={styles.footer}>
        <ThemedText>¿Ya tienes una cuenta?</ThemedText>
        <Link href="/(tabs)/(Auth)/login" style={styles.link}>
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
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
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