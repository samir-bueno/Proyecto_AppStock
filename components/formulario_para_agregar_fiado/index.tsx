import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { z } from "zod";

// Define Zod schema for form validation
const schema = z.object({
  nombre: z
    .string()
    .min(2, { message: "El campo 'nombre' debe contener al menos dos letras" }),
      apellido: z
    .string()
    .min(2, { message: "El campo 'nombre' debe contener al menos dos letras" }),
});

const FormuloarioParaAgregarUnFiado = () => {
  // Initialize the form with React Hook Form and Zod schema resolver
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  // Function to handle form submission
  const onSubmit = (data: z.infer<typeof schema>) => {

    console.log(data);
  };

  return (
    <View style={styles.container}>
      <Text>Nombre</Text>
      <Controller
        control={control}
        name="nombre"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Ingrese su nombre"
          />
        )}
      />
      {errors.nombre && <Text style={styles.error}>El campo 'nombre' debe contener al menos dos letras</Text>}


      <Button testID="agregar" title="Agregar" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  error: {
    color: "red",
  },
});

export default FormuloarioParaAgregarUnFiado;
