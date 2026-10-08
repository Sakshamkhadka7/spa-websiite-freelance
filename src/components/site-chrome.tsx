import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Facebook, Instagram, Menu, ShoppingBag, Twitter, X } from "lucide-react";
import lavishSpaLogo from "@/assets/lavishspa.jpeg";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { useContent } from "@/hooks/use-data";
import { demoSiteCopy } from "@/lib/demo-content";

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
    <header className="sticky top-0 z-40 px-3 py-3 sm:px-5" aria-label="Site header">
      <div className="container-spa overflow-hidden rounded-[1.75rem] border border-white/70 bg-background/95 px-4 shadow-[0_12px_35px_-18px_rgba(45,52,32,0.5)] backdrop-blur-xl sm:px-6">
        <div className="flex min-h-20 items-center justify-between gap-4 2xl:min-h-24">
          <Link
            to="/"
            className="group flex shrink-0 items-center leading-none"
            aria-label={`${content?.spaName || "The Lavish Spa"} home`}
          >
            <img
              src={lavishSpaLogo}
              alt="The Lavish Spa"
              width={1600}
              height={1600}
              className="h-16 w-16 rounded-xl bg-[#251f1f] object-contain shadow-[0_8px_22px_-12px_rgba(37,31,31,0.8)] ring-1 ring-[#d9ad68]/45 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_12px_28px_-12px_rgba(37,31,31,0.9)] sm:h-[4.5rem] sm:w-[4.5rem]"
            />
          </Link>

          <nav className="hidden items-center gap-5 xl:flex 2xl:gap-8" aria-label="Main navigation">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="relative whitespace-nowrap py-2 text-[0.92rem] font-normal text-foreground/70 transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-center after:scale-x-0 after:bg-primary after:transition-transform hover:text-primary hover:after:scale-x-100"
                activeProps={{ className: "text-primary after:scale-x-100" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <Link
              to="/book"
              className="relative rounded-full p-2.5 text-foreground/75 transition-colors hover:bg-muted hover:text-primary"
              aria-label="Booking cart"
            >
              <ShoppingBag className="h-5 w-5 stroke-[1.6]" />
              {items.length > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[0.6rem] text-primary-foreground">
                  {items.length}
                </span>
              )}
            </Link>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden rounded-full px-5 sm:inline-flex"
                  >
                    {user.name.split(" ")[0]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() =>
                      navigate({ to: user.role === "admin" ? "/admin" : "/dashboard" })
                    }
                  >
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      logout();
                      navigate({ to: "/" });
                    }}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                asChild
                size="sm"
                className="hidden h-11 rounded-full px-6 shadow-none sm:inline-flex"
              >
                <Link to="/login" search={{ redirect: undefined }}>
                  Login / Register
                </Link>
              </Button>
            )}
            <button
              className="rounded-full p-2.5 text-foreground transition-colors hover:bg-muted xl:hidden"
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="border-t border-border/70 py-3 xl:hidden">
            <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm text-foreground/80 transition-colors hover:bg-muted hover:text-primary"
                  activeProps={{ className: "bg-muted text-primary" }}
                  activeOptions={{ exact: n.to === "/" }}
                >
                  {n.label}
                </Link>
              ))}
              {user ? (
                <Link
                  to={user.role === "admin" ? "/admin" : "/dashboard"}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm text-primary hover:bg-muted"
                >
                  My Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  search={{ redirect: undefined }}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm text-primary hover:bg-muted sm:hidden"
                >
                  Login / Register
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export function SiteFooter() {
  const { data: c } = useContent();
  if (!c) return null;
  return (
    <footer className="bg-earth text-earth-foreground">
      <div className="container-spa grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_0.9fr_1.1fr] lg:py-20">
        <div>
          <p className="font-display text-[clamp(2.5rem,3vw,3.75rem)]">{c.spaName}</p>
          <p className="mt-3 max-w-xl leading-relaxed opacity-70">
            {c.footerText || demoSiteCopy.footer}
          </p>
          <div className="mt-6 flex gap-3">
            {[
              { h: c.social?.facebook, I: Facebook },
              { h: c.social?.instagram, I: Instagram },
              { h: c.social?.twitter, I: Twitter },
            ]
              .filter(({ h }) => Boolean(h))
              .map(({ h, I }) => (
                <a
                  key={h}
                  href={h}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-earth-foreground/20 p-2 hover:bg-earth-foreground/10"
                >
                  <I className="h-4 w-4" />
                </a>
              ))}
          </div>
        </div>
        <div>
          <p className="eyebrow mb-4 text-accent">Explore</p>
          <div className="space-y-2.5 text-sm">
            {nav.slice(0, 4).map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block opacity-75 transition-opacity hover:opacity-100"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="eyebrow mb-4 text-accent">Treatments</p>
          <div className="space-y-2.5 text-sm opacity-80">
            {["Massage rituals", "Hot stone therapy", "Aromatherapy", "Facial & body care"].map(
              (service) => (
                <Link
                  key={service}
                  to="/services"
                  className="block transition-opacity hover:opacity-100"
                >
                  {service}
                </Link>
              ),
            )}
          </div>
        </div>
        <div>
          <p className="eyebrow mb-4 text-accent">Visit</p>
          <p className="text-sm leading-relaxed opacity-80">{c.contact.address}</p>
          <p className="mt-3 text-sm opacity-80">{c.contact.phone}</p>
          <p className="text-sm opacity-80">{c.contact.email}</p>
          <div className="mt-5 space-y-1">
            {c.openingHours.slice(0, 2).map((h) => (
              <p key={h.day} className="text-xs opacity-65">
                {h.day}: {h.hours}
              </p>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-earth-foreground/10 py-5 text-center text-xs opacity-60">
        © {new Date().getFullYear()} {c.spaName}. All rights reserved. Demo business details for
        presentation.
      </div>
    </footer>
  );
}
