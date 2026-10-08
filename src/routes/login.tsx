import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/shared";
import { useAuth } from "@/hooks/use-auth";
import { getErrorMessage } from "@/lib/api";
import { img } from "@/lib/images";
import { loginSchema, type LoginValues } from "@/schemas";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>) => ({
    redirect: typeof s["redirect"] === "string" ? s["redirect"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Login — Salus Per Aquam" },
      { name: "description", content: "Sign in to book treatments and manage your appointments." },
      { property: "og:title", content: "Login — Salus Per Aquam" },
      { property: "og:description", content: "Sign in to your spa account." },
    ],
  }),
  component: Login,
});

export function AuthShell({
  title,
  text,
  children,
}: {
  title: string;
  text: string;
  children: React.ReactNode;
}) {
  return (
    <main className="grid min-h-[calc(100svh-5rem)] md:grid-cols-2">
      <img
        src={img("asset:hotstone")}
        alt=""
        className="hidden h-full w-full object-cover md:block"
      />
      <div className="flex items-center justify-center px-6 py-16 lg:px-12">
        <div className="w-full max-w-md fade-up">
          <h1 className="display-section">{title}</h1>
          <p className="body-copy mb-9 mt-3 text-muted-foreground">{text}</p>
          {children}
        </div>
      </div>
    </main>
  );
}

function Login() {
  const { redirect } = Route.useSearch();
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (v: LoginValues) => {
    try {
      const u = await login(v);
      toast.success(`Welcome back, ${u.name.split(" ")[0]}`);
      if (redirect) navigate({ to: redirect });
      else navigate({ to: u.role === "admin" ? "/admin" : "/dashboard" });
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      text={redirect ? "Please sign in to continue your booking." : "Sign in to your account."}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="Email" error={errors.email?.message}>
          <Input type="email" {...register("email")} />
        </Field>
        <Field label="Password" error={errors.password?.message}>
          <Input type="password" {...register("password")} />
        </Field>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <p className="mt-6 text-sm text-muted-foreground">
        New here?{" "}
        <Link to="/register" search={{ redirect }} className="text-primary underline">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
