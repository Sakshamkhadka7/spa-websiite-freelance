import { useNavigate } from "@tanstack/react-router";
import { Check, Clock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useCurrency } from "@/hooks/use-data";
import { img } from "@/lib/images";
import type { Service } from "@/types";

export function ServiceCard({ service }: { service: Service }) {
  const cart = useCart();
  const money = useCurrency();
  const navigate = useNavigate();
  const inCart = cart.has(service.id);
  const isDemo = service.id.startsWith("demo-");

  const bookNow = () => {
    cart.add(service.id);
    navigate({ to: "/book" });
  };

  return (
    <article className="surface-card group flex flex-col overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-soft">
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={img(service.image)}
          alt={service.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-6 lg:p-7">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="eyebrow">{service.category}</p>
          {isDemo && (
            <span className="rounded-full bg-accent/35 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-accent-foreground">
              Demo treatment
            </span>
          )}
        </div>
        <h3 className="heading-card">{service.name}</h3>
        <p className="mt-3 flex-1 leading-relaxed text-muted-foreground">{service.description}</p>
        <div className="mt-5 flex items-center justify-between border-t pt-4">
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {service.duration} min
          </span>
          <span className="font-display text-[1.65rem]">{money(service.price)}</span>
        </div>
        {isDemo ? (
          <p className="mt-4 rounded-xl bg-muted px-4 py-3 text-center text-sm text-muted-foreground">
            Presentation content — add this service in Admin to enable booking.
          </p>
        ) : (
          <div className="mt-4 flex gap-2">
            <Button className="flex-1" onClick={bookNow}>
              Book Now
            </Button>
            <Button
              variant="outline"
              disabled={inCart}
              onClick={() => {
                cart.add(service.id);
                toast.success(`${service.name} added to your booking cart`);
              }}
            >
              {inCart ? <Check className="h-4 w-4" /> : "Add"}
            </Button>
          </div>
        )}
      </div>
    </article>
  );
}
