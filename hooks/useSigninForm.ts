import { useAuth } from "@/contexts/AuthProvider";
import { useRouter } from "expo-router";
import { useState } from "react";
import { z } from "zod";

// Schema de validación
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

// Tipo específico para errores que permite undefined
type FormErrors = {
  nombre?: string;
  email?: string;
  contraseña?: string;
  confirmacion?: string;
  general?: string;
};

export const useSigninForm = () => {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState<SignupFormData>({
    nombre: "",
    email: "",
    contraseña: "",
    confirmacion: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    try {
      signupSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        error.issues.forEach((err: any) => {
          if (err.path[0]) {
            const fieldName = err.path[0] as keyof FormErrors;
            newErrors[fieldName] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleCrearCuenta = async () => {
    setErrors({});

    if (!validateForm()) return;

    setLoading(true);
    const { success, error } = await register({
      name: formData.nombre.trim(),
      email: formData.email.trim(),
      password: formData.contraseña,
      passwordConfirm: formData.confirmacion,
    });

    if (success) {
      router.push("/(Auth)/login");
    } else {
      // Detectar error de email duplicado
      const errorMessage = error?.toLowerCase() || "";
      if (
        errorMessage.includes("email") ||
        errorMessage.includes("exist") ||
        errorMessage.includes("duplicado")
      ) {
        setErrors({ email: "Este email ya está registrado" });
      } else {
        setErrors({ general: error || "Error al crear la cuenta" });
      }
    }
    setLoading(false);
  };

  const handleFieldChange = (field: keyof SignupFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Limpiar errores al escribir
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: undefined }));
    }
  };

  return {
    formData,
    loading,
    errors,
    handleFieldChange,
    handleCrearCuenta,
  };
};
