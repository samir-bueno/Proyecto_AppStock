import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/contexts/AuthProvider';
import { useRouter } from "expo-router";
import { Button, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function HomeScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/(Auth)/login'); // Redirigir a la pantalla de login después de cerrar sesión
  };

  return (
    <SafeAreaView>
      <ThemedText style={styles.h1}>Bienvenido {user?.name}</ThemedText>
      <Button title="Cerrar Sesión" onPress={handleLogout} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  h1: {
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    gap: 5,
  },
  
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
