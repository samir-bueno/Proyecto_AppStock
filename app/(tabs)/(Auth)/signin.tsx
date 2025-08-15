import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link, useRouter } from "expo-router";
import PocketBase from "pocketbase";
import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";

const pb = new PocketBase("http://127.0.0.1:8090");

export default function SigninForm() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [loading, setLoading] = useState(false); // Estado para mostrar un indicador de carga
  const router = useRouter();

  // La función ahora es asíncrona (async) para poder usar await
  const handleCrearCuenta = async () => {
    if (
      nombre === "" ||
      email === "" ||
      contraseña === "" ||
      confirmacion === ""
    ) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    // 2. Validación de que las contraseñas coincidan
    if (contraseña !== confirmacion) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    setLoading(true); // Inicia la carga

    // 3. Creación del objeto de datos con el formato CORRECTO
    const data = {
      name: nombre,
      email: email,
      emailVisibility: true,
      password: contraseña,
      passwordConfirm: confirmacion,
    };

    // 4. Llamada a la API dentro de un try...catch
    try {
      // Usamos 'await' para esperar a que la promesa se resuelva
      const record = await pb.collection("users").create(data);

      Alert.alert(
        "¡Éxito!",
        "Tu cuenta ha sido creada. Por favor, revisa tu correo para verificarla."
      );
      router.push("/(tabs)/(Auth)/login"); // Redirige al login después del éxito
    } catch (error: any) {
      // El bloque catch se ejecuta si la API devuelve un error
      console.error("Error al crear la cuenta:", JSON.stringify(error));
      Alert.alert(
        "Error al crear la cuenta",
        "El correo electrónico ya podría estar en uso o hubo un problema con el servidor."
      );
    } finally {
      setLoading(false); // Detiene la carga, tanto si tuvo éxito como si falló
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        keyboardType="name-phone-pad"
        autoCapitalize="none"
        onChangeText={(text) => setNombre(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={contraseña}
        secureTextEntry
        onChangeText={(text) => setContraseña(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña"
        value={confirmacion}
        secureTextEntry
        onChangeText={(text) => setConfirmacion(text)}
      />
      <Button title="Entrar" onPress={handleCrearCuenta} />
      <ThemedView style={styles.container}>
        <Text style={styles.title}>¿Ya tienes una cuenta?</Text>
        <Link href="/(tabs)/(Auth)/login" style={styles.link}>
          <ThemedText type="link">Iniciar Sesion</ThemedText>
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
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
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
