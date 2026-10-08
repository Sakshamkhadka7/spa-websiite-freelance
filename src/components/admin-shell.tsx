import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  CalendarDays,
  Images,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Sparkles,
  Users,
  UserRound,
  FileText,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Spinner } from "./shared";

const links = [
  ["/admin", "Dashboard", LayoutDashboard],
  ["/admin/bookings", "Bookings", CalendarDays],
  ["/admin/customers", "Customers", Users],
  ["/admin/services", "Services", Sparkles],
  ["/admin/team", "Team / Therapists", UserRound],
  ["/admin/gallery", "Gallery", Images],
  ["/admin/content", "Website Content", FileText],
  ["/admin/settings", "Settings", Settings],
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const { user, ready, logout } = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const loginPage = path === "/admin/login";
  useEffect(() => {
    if (!loginPage && ready && user?.role !== "admin")
      navigate({ to: "/admin/login", replace: true });
  }, [ready, user, navigate, loginPage]);
  if (loginPage) return <>{children}</>;
  if (!ready || user?.role !== "admin")
    return (
      <div className="grid min-h-screen place-items-center">
        <Spinner />
      </div>
    );
  const side = (
    <>
      <div className="flex h-20 items-center justify-between px-6 2xl:h-24">
        <Link to="/" className="font-display text-2xl text-sidebar-foreground">
          Salus Admin
        </Link>
        <button className="lg:hidden" onClick={() => setOpen(false)}>
          <X />
        </button>
      </div>
      <nav className="space-y-1 px-3">
        {links.map(([to, label, I]) => (
          <Link
            key={to}
            to={to}
            onClick={() => setOpen(false)}
            className={`flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${path === to ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground/80 hover:bg-sidebar-accent"}`}
          >
            <I className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
      <button
        onClick={() => {
          logout();
          navigate({ to: "/admin/login" });
        }}
        className="mx-3 mt-8 flex min-h-11 w-[calc(100%-1.5rem)] items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </>
  );
  return (
    <div className="min-h-screen bg-muted/30">
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 bg-sidebar lg:block 2xl:w-72">
        {side}
      </aside>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 lg:hidden" onClick={() => setOpen(false)}>
          <aside className="h-full w-72 bg-sidebar" onClick={(e) => e.stopPropagation()}>
            {side}
          </aside>
        </div>
      )}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur lg:ml-64 lg:px-8 2xl:ml-72 2xl:h-20 2xl:px-10">
        <button className="lg:hidden" onClick={() => setOpen(true)}>
          <Menu />
        </button>
        <div className="ml-auto text-sm">
          <span className="text-muted-foreground">Signed in as </span>
          {user.name}
        </div>
      </header>
      <main className="p-4 sm:p-6 lg:ml-64 lg:p-8 2xl:ml-72 2xl:p-10">{children}</main>
    </div>
  );
}

export function AdminPage({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[92rem]">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 lg:mb-10">
        <div>
          <h1 className="text-[clamp(2.5rem,3.5vw,4.25rem)]">{title}</h1>
          {description && <p className="mt-2 max-w-3xl text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
