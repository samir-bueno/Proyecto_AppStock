import PocketBase from "pocketbase";

export const POCKETBASE_URL = "http://192.168.0.13:8090";
export const pb = new PocketBase(POCKETBASE_URL);

//Autenticación
export const registerUser = async (data: any) => { try {
    const userData = {
      ...data,
      emailVisibility: true,
    };
    const record = await pb.collection("users").create(userData);
    return { success: true, data: record };
  } catch (error: any) {
    console.error("Error en registerUser:", error);
    return { success: false, error: error.message };
  } };
export const loginUser = async (email: string, password: string) => { try {
    const authData = await pb
      .collection("users")
      .authWithPassword(email, password);
    return { success: true, user: authData.record };
  } catch (error: any) {
    console.error("Error en loginUser:", error);
    return { success: false, error: error.message };
  } };
export const isAuthenticated = () => pb.authStore.isValid;

export interface ClientData {
  name: string;
  phone?: string;
  owner_id: string;
}

// Función para cargar productos de un usuario
export const getProductsByOwner = async (ownerId: string) => {
  try {
    const records = await pb.collection('products').getFullList({
        filter: `owner_id = "${ownerId}"`,
    });
    return { success: true, data: records };
  } catch (error: any) {
    return { success: false, error: "No se pudieron cargar los productos" };
  }
};

// Función para crear un nuevo producto
export const createProduct = async (productData: any) => {
  try {
    // owner_id debe estar en productData
    const record = await pb.collection('products').create(productData);
    return { success: true, data: record };
  } catch (error: any) {
    return { success: false, error: "No se pudo agregar el producto" };
  }
};

// Función para OBTENER los clientes de un usuario
export const getCustomersByOwner = async (ownerId: string) => {
  try {
    const records = await pb.collection('customers').getFullList({
        filter: `owner_id = "${ownerId}"`,
    });
    return { success: true, data: records };
  } catch (error: any) {
    console.error("Error en getCustomersByOwner:", error);
    return { success: false, error: "No se pudieron cargar los clientes" };
  }
};

// Función para crear un nuevo cliente fiado
export const createCustomer = async (customerData: ClientData) => {
  try {
    const record = await pb.collection('customers').create(customerData);
    return { success: true, data: record };
  } catch (error: any) {
    console.error("Error en createCustomer:", error);
    return { success: false, error: "No se pudo agregar el cliente" };
  }
};