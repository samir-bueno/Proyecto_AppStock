// axiosInstance.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const POCKETBASE_URL = "http://192.168.0.78:8090";

const axiosInstance = axios.create({
  baseURL: POCKETBASE_URL,
});

// Interceptor para agregar el token de autenticación a las peticiones
axiosInstance.interceptors.request.use(async (config) => {
  try {
    // Obtener el token de AsyncStorage
    const token = await AsyncStorage.getItem("pb_auth_token");
    if (token) {
      config.headers.Authorization = token;
    }
  } catch (error) {
    console.error("Error leyendo el token de AsyncStorage:", error);
  }
  return config;
});

export default axiosInstance;
