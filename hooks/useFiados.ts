// hooks/useFiados.ts
import { validateDuplicateClient } from "@/components/fiados/validacion_de_cliente";
import { useAuth } from "@/contexts/AuthProvider";
import {
  createCustomer,
  Customer,
  getCustomersByOwner,
} from "@/services/pocketbaseServices";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

export const useFiados = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addingClient, setAddingClient] = useState(false);
  const [errorDuplicado, setErrorDuplicado] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Función para cargar clientes desde PocketBase
  const loadClients = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const result = await getCustomersByOwner(user.id);
    if (result.success) {
      setClients(result.data || []);
    } else {
      Alert.alert("Error", result.error);
    }
    setLoading(false);
  };

  // Cargar clientes al montar el componente
  useEffect(() => {
    loadClients();
  }, [user]);

  // Función para agregar nuevo cliente
  const handleAddNewClient = async (clientData: {
    nombre: string;
    telefono?: string;
    deuda: string;
  }) => {
    if (!user) {
      Alert.alert("Error", "No hay usuario autenticado");
      return;
    }

    if (!clientData.nombre.trim()) {
      Alert.alert("Error", "El nombre es obligatorio");
      return;
    }

    // Validar duplicados
    if (validateDuplicateClient(clients, clientData.nombre)) {
      setErrorDuplicado(true);
      return;
    }

    setErrorDuplicado(false);
    setAddingClient(true);

    const result = await createCustomer({
      name: clientData.nombre,
      phone: clientData.telefono,
      deuda: clientData.deuda,
      owner_id: user.id,
    });

    if (result.success) {
      Alert.alert("Éxito", "Cliente agregado correctamente");
      await loadClients(); // Recargamos la lista para ver el nuevo cliente
      setShowAddForm(false);
    } else {
      Alert.alert("Error", result.error);
    }
    setAddingClient(false);
  };

  const toggleDetails = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const openAddForm = () => setShowAddForm(true);
  const closeAddForm = () => {
    setShowAddForm(false);
    setErrorDuplicado(false);
  };

  return {
    // Estado
    user,
    clients,
    loading,
    showAddForm,
    addingClient,
    errorDuplicado,
    expandedId,

    // Funciones
    loadClients,
    handleAddNewClient,
    toggleDetails,
    openAddForm,
    closeAddForm,

    // Setters para estados específicos si los necesitas
    setErrorDuplicado,
  };
};
