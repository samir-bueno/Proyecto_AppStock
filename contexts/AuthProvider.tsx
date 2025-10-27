import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { loginUser, logoutUser, registerUser } from '../services/pocketbaseServices';
// Tipo mínimo para el usuario (ajusta según lo que retorna tu API)
interface UserModel {
  id: string;
  name?: string;
  email?: string;
  [key: string]: any;
}

// Definir la interfaz para el valor del contexto
interface AuthContextType {
  user: UserModel | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (data: {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
  }) => Promise<{ success: boolean; error?: string }>;
}

// El valor por defecto es 'undefined' para asegurar que el hook falle si se usa fuera del provider.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Crear el componente Provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserModel | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Inicializar desde AsyncStorage (token + user) si existe
    const initializeAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('pb_auth_token');
        const rawUser = await AsyncStorage.getItem('pb_auth_user');
        
        if (token) {
          setIsAuthenticated(true);
          if (rawUser) {
            try {
              setUser(JSON.parse(rawUser));
            } catch (e) {
              setUser(null);
            }
          }
        }
      } catch (error) {
        console.error('Error al inicializar AuthProvider desde AsyncStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // No hay listeners externos porque ya no usamos pb.authStore
    return () => {};
  }, []);

  // Función de Login
  const login = async (email: string, password: string) => {
    const result = await loginUser(email, password);

    if (result.success && result.data) {
      setUser(result.data as UserModel);
      setIsAuthenticated(true);
    } else {
      // Aseguramos limpiar almacenamiento local
      try {
        logoutUser();
      } catch (e) {}
      setUser(null);
      setIsAuthenticated(false);
    }
    return { success: result.success, error: result.error };
  };

  // Función de Registro
  const register = async (data: {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
  }) => {
    const result = await registerUser(data);
    return { success: result.success, error: result.error };
  };

  // Función de Logout
  const logout = () => {
    try {
      logoutUser();
    } catch (e) {
      // ignore
    }
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};