import { useAuth } from "@/contexts/AuthProvider";
import { checkEmailExists } from "@/services/pocketbaseServices";
import { useRouter } from "expo-router";
import { useState } from "react";
import { z } from "zod";

export const signupSchema = z
  .object({
    nombre: z.string().min(1, "El nombre es requerido"),
    email: z.string().min(1, "El email es requerido").email("Email inválido"),
    contraseña: z.string().min(8, "Mínimo 8 caracteres"),
    confirmacion: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((data) => data.contraseña === data.confirmacion, {
    message: "Las contraseñas no coinciden",
    path: ["confirmacion"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;

type FormErrors = {
  general?: string;
};

export const useSigninForm = () => {
  const router = useRouter();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleCrearCuenta = async (data: SignupFormData) => {
    setErrors({});

    setLoading(true);

    const { success, error } = await register({
      name: data.nombre.trim(),
      email: data.email.trim(),
      password: data.contraseña,
      passwordConfirm: data.confirmacion,
    });

    if (success) {
      router.push("/(Auth)/login");
    } else {
      const emailTomado = await checkEmailExists(data.email.trim());
      try {
        if (emailTomado) {
          setErrors({ general: "Este email ya está registrado" });
          setLoading(false);
          return;
        }
        setErrors({ general: error || "Ocurrió un error en el registro." });

      } catch (e) {
        setErrors({ general: "Error al verificar el email. Intenta de nuevo." });
        setLoading(false);
        return;
      }
    }
    setLoading(false);
  };

  return {
    loading,
    errors,
    handleCrearCuenta,
  };
};