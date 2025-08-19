import { RecordModel } from 'pocketbase';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { loginUser, pb, registerUser } from '../services/pocketBaseService';

// Definir la interfaz para el valor del contexto
interface AuthContextType {
  user: RecordModel | null;
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
  const [user, setUser] = useState<RecordModel | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      if (pb.authStore.isValid) {
        setUser(pb.authStore.model);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error al inicializar AuthProvider:", error);
      pb.authStore.clear();
    } finally {
      setIsLoading(false);
    }

    // Escuchar cambios en el authStore para mantener el estado sincronizado
    const removeListener = pb.authStore.onChange(() => {
        setIsAuthenticated(pb.authStore.isValid);
        setUser(pb.authStore.model);
    });

    // Limpiar el listener cuando el componente se desmonte
    return () => {
        removeListener();
    };
  }, []);

  // Función de Login
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const result = await loginUser(email, password);
    if (result.success && result.user) {
      setUser(result.user);
      setIsAuthenticated(true);
    } else {
      pb.authStore.clear();
      setUser(null);
      setIsAuthenticated(false);
    }
    setIsLoading(false);
    return { success: result.success, error: result.error };
  };

  // Función de Registro
  const register = async (data: {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
  }) => {
    setIsLoading(true);
    const result = await registerUser(data);
    setIsLoading(false);
    return { success: result.success, error: result.error };
  };

  // Función de Logout
  const logout = () => {
    pb.authStore.clear();
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