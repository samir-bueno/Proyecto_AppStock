import { ThemedText } from '@/components/ThemedText';
import { StyleSheet } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <ThemedText style={styles.h1}>Bienvenido</ThemedText>
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
