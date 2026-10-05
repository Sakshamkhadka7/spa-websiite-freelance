import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Facebook, Instagram, Menu, ShoppingBag, Twitter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { useContent } from "@/hooks/use-data";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/services", label: "Services" },
  { to: "/gallery", label: "Gallery" },
  { to: "/book", label: "Book Appointment" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const { data: content } = useContent();
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="container-spa flex h-18 items-center justify-between py-4">
        <Link to="/" className="flex flex-col leading-none">
          <span className="font-display text-2xl">{content?.logoText}</span>
          <span className="text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground">Per Aquam</span>
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="text-sm text-foreground/75 transition-colors hover:text-primary"
              activeProps={{ className: "text-primary font-normal" }} activeOptions={{ exact: n.to === "/" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/book" className="relative rounded-full p-2 hover:bg-muted" aria-label="Booking cart">
            <ShoppingBag className="h-5 w-5" />
            {items.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[0.6rem] text-primary-foreground">{items.length}</span>
            )}
          </Link>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden sm:inline-flex">{user.name.split(" ")[0]}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate({ to: user.role === "admin" ? "/admin" : "/dashboard" })}>Dashboard</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { logout(); navigate({ to: "/" }); }}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" className="hidden sm:inline-flex"><Link to="/login">Login / Register</Link></Button>
          )}
          <button className="p-2 lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t bg-background lg:hidden">
          <div className="container-spa flex flex-col gap-1 py-4">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-2 text-foreground/80">{n.label}</Link>
            ))}
            {user ? (
              <Link to={user.role === "admin" ? "/admin" : "/dashboard"} onClick={() => setOpen(false)} className="py-2 text-primary">My Dashboard</Link>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} className="py-2 text-primary">Login / Register</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  const { data: c } = useContent();
  if (!c) return null;
  return (
    <footer className="bg-earth text-earth-foreground">
      <div className="container-spa grid gap-10 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-4xl">{c.spaName}</p>
          <p className="mt-2 text-sm opacity-70">{c.footerText}</p>
          <div className="mt-6 flex gap-3">
            {[{ h: c.social.facebook, I: Facebook }, { h: c.social.instagram, I: Instagram }, { h: c.social.twitter, I: Twitter }].map(({ h, I }) => (
              <a key={h} href={h} target="_blank" rel="noreferrer" className="rounded-full border border-earth-foreground/20 p-2 hover:bg-earth-foreground/10"><I className="h-4 w-4" /></a>
            ))}
          </div>
        </div>
        <div>
          <p className="eyebrow mb-4 text-accent">Visit</p>
          <p className="text-sm opacity-80">{c.contact.address}</p>
          <p className="mt-2 text-sm opacity-80">{c.contact.phone}</p>
          <p className="text-sm opacity-80">{c.contact.email}</p>
        </div>
        <div>
          <p className="eyebrow mb-4 text-accent">Hours</p>
          {c.openingHours.map((h) => (
            <p key={h.day} className="text-sm opacity-80">{h.day}: {h.hours}</p>
          ))}
        </div>
      </div>
      <div className="border-t border-earth-foreground/10 py-5 text-center text-xs opacity-60">© {new Date().getFullYear()} {c.spaName}. All rights reserved.</div>
    </footer>
  );
}
