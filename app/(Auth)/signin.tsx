import FormularioSignin from "@/components/authentication/formularioSignin";
import { useSigninForm } from "@/hooks/useSigninForm";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function SigninForm() {
  const { loading, handleCrearCuenta, errors } = useSigninForm();

  return (
    <View style={styles.container}>
      <FormularioSignin
        alGuardarLosDatosDelFormulario={handleCrearCuenta}
        cargando={loading}
        errorServidor={errors.general}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
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
