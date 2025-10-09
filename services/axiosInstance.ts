// axiosInstance.ts
import axios from 'axios';

export const POCKETBASE_URL = "http://192.168.0.13:8090";

const axiosInstance = axios.create({
  baseURL: POCKETBASE_URL,
});

// Interceptor para agregar el token de autenticación a las peticiones
axiosInstance.interceptors.request.use((config) => {
  // Key usada por los servicios: 'pb_auth_token'
  const token = localStorage.getItem('pb_auth_token');
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export default axiosInstance;