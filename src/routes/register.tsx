import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/shared";
import { useAuth } from "@/hooks/use-auth";
import { getErrorMessage } from "@/lib/api";
import { registerSchema, type RegisterValues } from "@/schemas";
import { AuthShell } from "./login";

export const Route = createFileRoute("/register")({
  validateSearch: (s: Record<string, unknown>) => ({
    redirect: typeof s["redirect"] === "string" ? s["redirect"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Create Account — Salus Per Aquam" },
      { name: "description", content: "Register to book massage treatments online." },
      { property: "og:title", content: "Create Account — Salus Per Aquam" },
      { property: "og:description", content: "Join to book your next spa ritual." },
    ],
  }),
  component: Register,
});

function Register() {
  const { redirect } = Route.useSearch();
  const { register: signUp } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async ({ confirmPassword: _c, ...v }: RegisterValues) => {
    try {
      await signUp(v);
      toast.success("Account created — welcome!");
      navigate({ to: redirect ?? "/dashboard" });
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  return (
    <AuthShell title="Create account" text="Register to book and track your appointments.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="Full name" error={errors.name?.message}>
          <Input {...register("name")} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <Input type="email" {...register("email")} />
        </Field>
        <Field label="Phone" error={errors.phone?.message}>
          <Input type="tel" {...register("phone")} />
        </Field>
        <Field label="Password" error={errors.password?.message}>
          <Input type="password" {...register("password")} />
        </Field>
        <Field label="Confirm password" error={errors.confirmPassword?.message}>
          <Input type="password" {...register("confirmPassword")} />
        </Field>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating…" : "Create account"}
        </Button>
      </form>
      <p className="mt-6 text-sm text-muted-foreground">
        Already registered?{" "}
        <Link to="/login" search={{ redirect }} className="text-primary underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
