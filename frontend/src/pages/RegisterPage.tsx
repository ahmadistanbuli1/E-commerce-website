import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../config/api";
import ErrorMessage from "../components/ui/ErrorMessage";
import { RegisterSchema } from "../schema";
import { REGISTER_DATA } from "../data";

type RegisterFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export function RegisterPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(RegisterSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    await api.post("/auth/register", values);
    navigate("/");
  });

  const renderRegisterInputs = REGISTER_DATA.map((input) => (
    <div key={input.name}>
      <label className="text-sm font-medium text-slate-800">
        {input.placeholder}
      </label>
      <input
        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        type={input.type}
        {...register(input.name)}
      />
      {errors[input.name] && <ErrorMessage msg={errors[input.name]?.message} />}
    </div>
  ));

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h1 className="text-xl font-bold text-slate-900">Create Account</h1>
        <p className="mt-1 text-sm text-slate-600">
          Already have an account?{" "}
          <Link className="text-blue-700 hover:underline" to="/login">
            Login
          </Link>
        </p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          {renderRegisterInputs}
          <button
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            type="submit"
          >
            إنشاء حساب
          </button>
        </form>
      </div>
    </div>
  );
}
