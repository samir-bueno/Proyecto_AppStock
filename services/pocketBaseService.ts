import PocketBase from "pocketbase";

const POCKETBASE_URL = "http://10.9.121.245:8090";
export const pb = new PocketBase(POCKETBASE_URL);

// Registro de usuario
export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}) => {
  try {
    const userData = {
      ...data,
      emailVisibility: true,
    };
    const record = await pb.collection("users").create(userData);
    return { success: true, data: record };
  } catch (error: any) {
    console.error("Error en registerUser:", error);
    return { success: false, error: error.message };
  }
};

// Inicio de sesión
export const loginUser = async (email: string, password: string) => {
  try {
    const authData = await pb
      .collection("users")
      .authWithPassword(email, password);
    return { success: true, user: authData.record };
  } catch (error: any) {
    console.error("Error en loginUser:", error);
    return { success: false, error: error.message };
  }
};

// Verificar autenticación
export const isAuthenticated = () => pb.authStore.isValid;
