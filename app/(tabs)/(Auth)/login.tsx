import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link, useRouter } from "expo-router";
import PocketBase from "pocketbase";
import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";

const pb = new PocketBase("http://127.0.0.1:8090");
export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [contraseña, setContraseña] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    if (email === "" || contraseña === "") {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }
    setLoading(true);

    try {
      // Usamos 'await' para esperar a que la promesa se resuelva
      const authData = await pb
        .collection("users")
        .authWithPassword(email, contraseña);

      console.log("¡Éxito!", "Bienvenido");
      router.push("/"); // Redirige al login después del éxito
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error);
      Alert.alert(
        "Error",
        "Credenciales incorrectas o problema de conexión. Por favor, inténtalo de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={text => setEmail(text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={contraseña}
        onChangeText={text => setContraseña(text)}
        secureTextEntry
      />
      <Button
        title={loading ? "Cargando..." : "Ingresar"}
        onPress={handleLogin}
      />
      <ThemedView style={styles.container}>
        <ThemedText type="title">¿No tienes una cuenta?</ThemedText>
        <Link href="/(tabs)/(Auth)/signin" style={styles.link}>
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
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
