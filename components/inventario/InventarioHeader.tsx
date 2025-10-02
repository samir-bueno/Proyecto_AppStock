import { ThemedText } from '@/components/ThemedText';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';


type Props = { userName?: string | null };


export default function InventarioHeader({ userName }: Props) {
  return (
    <LinearGradient
      colors={["#4a00e0", "#8e2de2"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      <View>
        <ThemedText style={styles.headerTitle}>AppStock</ThemedText>
        <ThemedText style={styles.headerSubtitle}>Bienvenido, {userName}</ThemedText>
      </View>
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
});


