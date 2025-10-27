import FormularioLogin from "@/components/authentication/formularioLogin";
import { useAuth } from "@/contexts/AuthProvider";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (data: { email: string; contraseña: string }) => {
    setLoading(true);
    setError(null);

    const { success, error } = await login(data.email, data.contraseña);
    
    if (success === true) {
      router.replace("/(tabs)/ventas"); // Redirige a la pantalla principal
    } else {
      const errorMessage = error?.includes("Network Error")
        ? "Error de conexión"
        : "Credenciales incorrectas";
      setError(errorMessage);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>

      <FormularioLogin
        alGuardarLosDatosDelFormulario={handleLogin}
        cargando={loading}
        errorServidor={error}
      />
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
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: {
    height: 50,
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  footer: { marginTop: 20, alignItems: "center", gap: 10 },
  link: { paddingVertical: 10 },
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
  closeButton: { color: "#721c24", fontWeight: "bold", padding: 5 },
});
