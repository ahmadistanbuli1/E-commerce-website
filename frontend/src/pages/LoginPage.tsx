import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../config/api";
import { AuthLayout } from "../components/layout/AuthLayout";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { loginSchema } from "../schema";
import { LOGIN_DATA } from "../data";
import { toastSuccess, toastError, getErrorMessage } from "../lib/toast";

type LoginFormValues = {
  email: string;
  password: string;
};

export function LoginPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema)
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await api.post("/auth/login", values);
      await qc.invalidateQueries({ queryKey: ["me"] });
      toastSuccess("Welcome back!");
      navigate("/products", { replace: true });
    } catch (error) {
      toastError(getErrorMessage(error, "Login failed"));
    }
  });

  return (
    <AuthLayout
      title="Welcome back"
      subtitle={
        <>
          Don&apos;t have an account?{" "}
          <Link className="font-medium text-blue-600 hover:text-blue-700" to="/register">
            Register
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        {LOGIN_DATA.map((input) => (
          <Input
            key={input.name}
            label={input.placeholder}
            type={input.type}
            error={errors[input.name as keyof LoginFormValues]?.message}
            {...register(input.name as keyof LoginFormValues)}
          />
        ))}

        <Button type="submit" fullWidth disabled={isSubmitting}>
          Login
        </Button>
      </form>
    </AuthLayout>
  );
}
