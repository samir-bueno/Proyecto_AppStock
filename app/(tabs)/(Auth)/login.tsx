import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function LoginForm() {
  
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
      />
      <Button title="Entrar" onPress={() => router.push("/")} />
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
    link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
