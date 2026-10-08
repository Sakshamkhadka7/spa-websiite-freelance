import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/shared";
import { useAuth } from "@/hooks/use-auth";
import { loginSchema, type LoginValues } from "@/schemas";
import { getErrorMessage } from "@/lib/api";
export const Route = createFileRoute("/admin/login")({ component: AdminLogin });
function AdminLogin() {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });
  const submit = async (v: LoginValues) => {
    try {
      const u = await login(v);
      if (u.role !== "admin") {
        logout();
        toast.error("This account does not have administrator access");
        return;
      }
      toast.success("Welcome back");
      navigate({ to: "/admin" });
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };
  return (
    <main className="grid min-h-screen place-items-center bg-earth px-4">
      <div className="surface-card w-full max-w-lg p-7 sm:p-9 lg:p-10">
        <ShieldCheck className="mb-5 h-10 w-10 text-primary" />
        <p className="eyebrow">Secure access</p>
        <h1 className="display-section mt-3">Admin Login</h1>
        <p className="mb-7 mt-2 text-sm text-muted-foreground">
          Sign in with an administrator account.
        </p>
        <form className="space-y-4" onSubmit={handleSubmit(submit)}>
          <Field label="Email" error={errors.email?.message}>
            <Input type="email" autoComplete="username" {...register("email")} />
          </Field>
          <Field label="Password" error={errors.password?.message}>
            <Input type="password" autoComplete="current-password" {...register("password")} />
          </Field>
          <Button className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in…" : "Sign in to dashboard"}
          </Button>
        </form>
      </div>
    </main>
  );
}
