import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { loginUser } from "@/services/pocketBaseService";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, StyleSheet, TextInput, View } from "react-native";
export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !contraseña) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    setLoading(true);
    const { success, error } = await loginUser(email, contraseña);

    if (success) {
      router.replace("/(tabs)/ventas"); // Redirige a la pantalla principal
    } else {
      const errorMessage = error.includes("Failed to fetch")
        ? "Error de conexión"
        : "Credenciales incorrectas";
      Alert.alert("Error", errorMessage);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source="https://artely.com.br/site/wp-content/uploads/2023/07/carrefour-logo-01-01.jpg"
        />
      </View>
      <ThemedText type="title" style={styles.title}>
        Iniciar sesión
      </ThemedText>
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
      <Button
        title={loading ? "Cargando..." : "Ingresar"}
        onPress={handleLogin}
        disabled={loading}
      />
      <ThemedView style={styles.footer}>
        <ThemedText>¿No tienes una cuenta?</ThemedText>
        <Link href="/(Auth)/signin" style={styles.link}>
          <ThemedText type="link">Crea una</ThemedText>
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
  image: {
    borderRadius: "100%",
    width: 60,
    height: 60,
    opacity: 0.8,
  },
  imageContainer: {
    alignItems: "center",
    borderRadius: "100%",
  },
});
