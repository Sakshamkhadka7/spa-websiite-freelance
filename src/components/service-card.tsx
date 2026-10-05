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

  const bookNow = () => {
    cart.add(service.id);
    navigate({ to: "/book" });
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg bg-card shadow-soft">
      <div className="aspect-[4/3] overflow-hidden">
        <img src={img(service.image)} alt={service.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="eyebrow mb-2">{service.category}</p>
        <h3 className="text-2xl">{service.name}</h3>
        <p className="mt-2 flex-1 text-sm text-muted-foreground">{service.description}</p>
        <div className="mt-5 flex items-center justify-between border-t pt-4">
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground"><Clock className="h-4 w-4" />{service.duration} min</span>
          <span className="font-display text-2xl">{money(service.price)}</span>
        </div>
        <div className="mt-4 flex gap-2">
          <Button className="flex-1" onClick={bookNow}>Book Now</Button>
          <Button variant="outline" disabled={inCart} onClick={() => { cart.add(service.id); toast.success(`${service.name} added to your booking cart`); }}>
            {inCart ? <Check className="h-4 w-4" /> : "Add"}
          </Button>
        </div>
      </div>
    </article>
  );
}
