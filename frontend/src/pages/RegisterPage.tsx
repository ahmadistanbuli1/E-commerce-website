import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../config/api";
import { AuthLayout } from "../components/layout/AuthLayout";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { RegisterSchema } from "../schema";
import { REGISTER_DATA } from "../data";
import { toastSuccess, toastError, getErrorMessage } from "../lib/toast";

type RegisterFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export function RegisterPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(RegisterSchema)
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await api.post("/auth/register", values);
      await qc.invalidateQueries({ queryKey: ["me"] });
      toastSuccess("Account created successfully!");
      navigate("/products", { replace: true });
    } catch (error) {
      toastError(getErrorMessage(error, "Registration failed"));
    }
  });

  return (
    <AuthLayout
      title="Create account"
      subtitle={
        <>
          Already have an account?{" "}
          <Link className="font-medium text-blue-600 hover:text-blue-700" to="/login">
            Login
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        {REGISTER_DATA.map((input) => (
          <Input
            key={input.name}
            label={input.placeholder}
            type={input.type}
            error={errors[input.name as keyof RegisterFormValues]?.message}
            {...register(input.name as keyof RegisterFormValues)}
          />
        ))}

        <Button type="submit" fullWidth disabled={isSubmitting}>
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}
