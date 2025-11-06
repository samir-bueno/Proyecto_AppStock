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
  deuda: string | "0";
  owner_id: string;
  activo?: boolean;
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

export interface VentaProduct extends Product {
  quantityInSale: number;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  deuda: string;
  owner_id: string;
  activo?: boolean;
  created?: string;
  updated?: string;
}

export interface Sale {
  id: string;
  owner_id: string;
  customer_id?: string; // opcional (null si es venta normal)
  total: string | "0";
  sale_type: "normal" | "fiado";
  created?: string;
  updated?: string;
}

export interface SaleItem {
  id: string;
  sale_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created?: string;
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

    await AsyncStorage.setItem('pb_auth_token', token);

    try {
      await AsyncStorage.setItem('pb_auth_user', JSON.stringify(record));
    } catch (e) {
    }

    return { success: true, data: record };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
};

export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const response = await axiosInstance.get(
      '/api/collections/users/records',
      {
        params: {
          filter: `(email='${email}')`,
          perPage: 1,
        }
      }
    );

    return response.data.items.length > 0;
  } catch (error) {
    console.error("Error al verificar email:", error);
    return false;
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
        filter: `owner_id = "${ownerId}" && activo = true`,
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

export const getSalesByOwner = async (ownerId: string): Promise<ApiResponse<Sale[]>> => {
  try {
    const response = await axiosInstance.get('/api/collections/sales/records', {
      params: {
        filter: `owner_id = "${ownerId}"`,
      },
    });

    return { success: true, data: response.data.items };
  } catch (error: any) {
    console.error("Error en getSalesByOwner:", error);
    return {
      success: false,
      error: "No se pudieron cargar las ventas del usuario"
    };
  }
};

export const getAllCustomersByOwner = async (ownerId: string): Promise<ApiResponse<Customer[]>> => {
  try {
    const response = await axiosInstance.get('/api/collections/customers/records', {
      params: {
        filter: `owner_id = "${ownerId}"`, // SIN FILTRO DE ACTIVO
      },
    });

    return { success: true, data: response.data.items };
  } catch (error: any) {
    console.error("Error en getAllCustomersByOwner:", error);
    return {
      success: false,
      error: "No se pudieron cargar los clientes"
    };
  }
};

export const createCustomer = async (customerData: ClientData): Promise<ApiResponse> => {
  try {
    const dataConActivo = {
      ...customerData,
      activo: true
    };

    const response = await axiosInstance.post('/api/collections/customers/records', dataConActivo);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error en createCustomer:", error);
    return {
      success: false,
      error: "No se pudo agregar el cliente"
    };
  }
};

export const updateCustomer = async (id: string, data: Partial<ClientData>): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.patch(`/api/collections/customers/records/${id}`, data);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error en updateCustomer:", error);
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
};

export const deleteCustomer = async (id: string): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.patch(`/api/collections/customers/records/${id}`, {
      activo: false // Marcamos como inactivo en lugar de eliminar
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error en deleteCustomer:", error);
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
};

export const getTotalCustomerDebt = async (ownerId: string): Promise<ApiResponse<number>> => {
  try {
    const customersResponse = await getCustomersByOwner(ownerId);

    if (!customersResponse.success || !customersResponse.data) {
      return { success: false, error: "No se pudieron cargar los datos de clientes para la deuda." };
    }

    const customers = customersResponse.data;

    const totalDebt = customers.reduce((sum, customer) => {
      return sum + parseFloat(customer.deuda || '0');
    }, 0);

    return { success: true, data: totalDebt };

  } catch (error: any) {
    console.error("Error en getTotalCustomerDebt:", error);
    return {
      success: false,
      error: "Error calculando la deuda total"
    };
  }
};

export const getTotalGain = async (ownerId: string): Promise<ApiResponse<number>> => {
  try {
    const salesResponse = await getSalesByOwner(ownerId);

    if (!salesResponse.success || !salesResponse.data) {
      return { success: false, error: "No se pudieron cargar las ventas del usuario para la ganancia" };
    }

    const sales = salesResponse.data;

    const totalGain = sales.reduce((sum, sale) => {
      return sum + parseFloat(sale.total|| '0');
    }, 0);

    return { success: true, data: totalGain };

  } catch (error: any) {
    console.error("Error en getTotalGain:", error);
    return {
      success: false,
      error: "Error calculando la ganancia total"
    };
  }
};

export const postVenta = async (ventaData: any): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.post('/api/collections/sales/records', ventaData);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error en postVenta:", error);

    // Mensaje de error más específico
    let errorMessage = "No se pudo procesar la venta";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage
    };
  }
};

export const createSale = async (
  saleData: Omit<Sale, "id" | "created" | "updated">
): Promise<ApiResponse<Sale>> => {
  try {
    const response = await axiosInstance.post(
      "/api/collections/sales/records",
      saleData
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error en createSale:", error);
    return {
      success: false,
      error: "No se pudo crear la venta",
    };
  }
};

// Crear items de venta
export const createSaleItems = async (
  items: Omit<SaleItem, "id" | "created">[]
): Promise<ApiResponse> => {
  try {
    // Crear todos los items en paralelo
    const promises = items.map((item) =>
      axiosInstance.post("/api/collections/sale_items/records", item)
    );

    await Promise.all(promises);
    return { success: true };
  } catch (error: any) {
    console.error("Error en createSaleItems:", error);
    return {
      success: false,
      error: "No se pudieron crear los items de venta",
    };
  }
};
