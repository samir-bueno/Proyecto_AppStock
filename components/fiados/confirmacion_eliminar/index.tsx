import { ThemedText } from "@/components/ThemedText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";


interface Props {
 alCancelar: () => void;
 alConfirmar: () => void;
 eliminando: boolean;
}


const ConfirmacionEliminar: React.FC<Props> = ({
 alCancelar,
 alConfirmar,
 eliminando,
}) => {
 return (
   <View style={styles.confirmationModalContent}>
     <MaterialCommunityIcons
       name="alert-circle-outline"
       size={50}
       color="#dc3545"
       style={styles.confirmationIcon}
     />
     <ThemedText style={styles.confirmationTitle}>
       ¿Marcar cliente como inactivo?
     </ThemedText>
     <ThemedText style={styles.confirmationMessage}>
       El cliente será marcado como inactivo y ya no aparecerá en la lista principal.
     </ThemedText>


     <View style={styles.confirmationButtons}>
       <TouchableOpacity
         style={[styles.confirmationButton, styles.cancelButton]}
         onPress={alCancelar}
         disabled={eliminando}
       >
         <ThemedText style={styles.cancelButtonText}>
           Cancelar
         </ThemedText>
       </TouchableOpacity>


       <TouchableOpacity
         style={[styles.confirmationButton, styles.deleteConfirmButton]}
         onPress={alConfirmar}
         disabled={eliminando}
       >
         {eliminando ? (
           <ActivityIndicator size="small" color="white" />
         ) : (
           <ThemedText style={styles.deleteButtonText}>
             Confirmar
           </ThemedText>
         )}
       </TouchableOpacity>
     </View>
   </View>
 );
};


const styles = StyleSheet.create({
 confirmationModalContent: {
   backgroundColor: "white",
   borderRadius: 12,
   padding: 24,
   width: "100%",
   maxWidth: 400,
   alignItems: "center",
 },
 confirmationIcon: {
   marginBottom: 16,
 },
 confirmationTitle: {
   fontSize: 20,
   fontWeight: "bold",
   marginBottom: 12,
   textAlign: "center",
   color: "#333",
 },
 confirmationMessage: {
   fontSize: 16,
   color: "#666",
   textAlign: "center",
   marginBottom: 24,
   lineHeight: 22,
 },
 confirmationButtons: {
   flexDirection: "row",
   justifyContent: "space-between",
   width: "100%",
   gap: 12,
 },
 confirmationButton: {
   flex: 1,
   padding: 15,
   borderRadius: 8,
   alignItems: "center",
   justifyContent: "center",
 },
 cancelButton: {
   backgroundColor: "#f1f1f1",
 },
 deleteConfirmButton: {
   backgroundColor: "#dc3545",
 },
 cancelButtonText: {
   color: "#333",
   fontWeight: "bold",
   fontSize: 16,
 },
 deleteButtonText: {
   color: "white",
   fontWeight: "bold",
   fontSize: 16,
 },
});


export default ConfirmacionEliminar;
