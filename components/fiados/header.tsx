import { useFiados } from "@/hooks/useFiados";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import { ThemedText } from "../ThemedText";
const Header = () => {
  const { user } = useFiados();
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      {/* Encabezado */}
      <LinearGradient
        colors={["#4a00e0", "#8e2de2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View>
          <ThemedText style={styles.headerTitle}>Fiado</ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Bienvenido, {user?.name}
          </ThemedText>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#4a00e0",
  },
  header: {
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "#fff",
    fontSize: 16,
    marginTop: 4,
  },
});
export default Header;
