import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function LoginForm( ) {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [contraseña, setContraseña] = useState("");
    const router = useRouter();

    const handleLogin = (): void => {
        if (nombre == "" || email == "" || contraseña == ""){
            Alert.alert("Error", "Complete todos los espacios, por favor")
            return;
        }
        else{
            router.push("/") 
        }
    }
    
    return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value= {nombre}
        keyboardType="name-phone-pad"
        autoCapitalize="none"
        onChangeText={text => setNombre(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={text => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={contraseña}
        secureTextEntry
        onChangeText={text => setContraseña(text)}
      />
      <Button title="Entrar" onPress={handleLogin}/>
      <ThemedView style={styles.container}>
          <ThemedText type="title">¿Ya tienes una cuenta?</ThemedText>
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
