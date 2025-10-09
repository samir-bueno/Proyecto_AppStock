// api.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from './axiosInstance';

// Interfaces
export interface User {
  id: string;
  email: string;
  username?: string;
}

export interface ClientData {
  name: string;
  phone?: string;
  owner_id: string;
}

export interface Product {
  id: string;
  product_name: string;
  quantity: string;
  owner_id: string;
  price: string;
  barcode: string;
  created?: string;
  updated?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  owner_id: string;
  created?: string;
  updated?: string;
}

// Tipos de respuesta
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

interface AuthResponse {
  token: string;
  record: User;
}

// Autenticación
export const registerUser = async (data: any): Promise<ApiResponse> => {
  try {
    const userData = {
      ...data,
      emailVisibility: true,
    };
    
    const response = await axiosInstance.post('/api/collections/users/records', userData);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error en registerUser:", error);
    return { 
      success: false, 
      error: error.response?.data?.message || error.message 
    };
  }
};

export const loginUser = async (email: string, password: string): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.post<AuthResponse>(
      '/api/collections/users/auth-with-password',
      {
        identity: email,
        password: password,
      }
    );

    const { token, record } = response.data;
    
    // 🔥 AGREGAR AWAIT - Esto es crucial
    await AsyncStorage.setItem('pb_auth_token', token);
    
    // También agregar await aquí
    try {
      await AsyncStorage.setItem('pb_auth_user', JSON.stringify(record));
    } catch (e) {
    }

    return { success: true, data: record };
  } catch (error: any) {
    console.error("Error en loginUser:", error);
    return { 
      success: false, 
      error: error.response?.data?.message || error.message 
    };
  }
};

export const isAuthenticated = (): boolean => {
  return !!AsyncStorage.getItem('pb_auth_token');
};

export const logoutUser = (): void => {
  AsyncStorage.removeItem('pb_auth_token');
  AsyncStorage.removeItem('pb_auth_user');
};

// Funciones para productos
export const getProductsByOwner = async (ownerId: string): Promise<ApiResponse<Product[]>> => {
  try {
    const response = await axiosInstance.get('/api/collections/products/records', {
      params: {
        filter: `owner_id = "${ownerId}"`,
      },
    });
    
    // PocketBase devuelve los items en la propiedad "items"
    return { success: true, data: response.data.items };
  } catch (error: any) {
    console.error("Error en getProductsByOwner:", error);
    return { 
      success: false, 
      error: "No se pudieron cargar los productos" 
    };
  }
};

export const createProduct = async (productData: any): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.post('/api/collections/products/records', productData);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error en createProduct:", error);
    return { 
      success: false, 
      error: "No se pudo agregar el producto" 
    };
  }
};

export const updateProduct = async (id: string, data: any): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.patch(`/api/collections/products/records/${id}`, data);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error en updateProduct:", error);
    return { 
      success: false, 
      error: error.response?.data?.message || error.message 
    };
  }
};

export const deleteProduct = async (id: string): Promise<ApiResponse> => {
  try {
    await axiosInstance.delete(`/api/collections/products/records/${id}`);
    return { success: true };
  } catch (error: any) {
    console.error("Error en deleteProduct:", error);
    return { 
      success: false, 
      error: error.response?.data?.message || error.message 
    };
  }
};

// Funciones para clientes
export const getCustomersByOwner = async (ownerId: string): Promise<ApiResponse<Customer[]>> => {
  try {
    const response = await axiosInstance.get('/api/collections/customers/records', {
      params: {
        filter: `owner_id = "${ownerId}"`,
      },
    });
    
    return { success: true, data: response.data.items };
  } catch (error: any) {
    console.error("Error en getCustomersByOwner:", error);
    return { 
      success: false, 
      error: "No se pudieron cargar los clientes" 
    };
  }
};

export const createCustomer = async (customerData: ClientData): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.post('/api/collections/customers/records', customerData);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error en createCustomer:", error);
    return { 
      success: false, 
      error: "No se pudo agregar el cliente" 
    };
  }
};