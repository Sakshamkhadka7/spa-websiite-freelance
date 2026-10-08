import { useEffect, useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState, Field, Spinner } from "@/components/shared";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { keys, useAction, useContent, useCurrency, useServices } from "@/hooks/use-data";
import { bookingService } from "@/services/booking.service";
export const Route = createFileRoute("/book")({ component: Book });
type Form = { date: string; time: string; guests: number; specialRequest: string };
function Book() {
  const { user, ready } = useAuth(),
    cart = useCart(),
    services = useServices(),
    content = useContent(),
    money = useCurrency(),
    nav = useNavigate();
  const selected = useMemo(
    () => services.data?.filter((s) => cart.items.includes(s.id)) ?? [],
    [services.data, cart.items],
  );
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Form>({ defaultValues: { guests: 1, specialRequest: "" } });
  useEffect(() => {
    if (ready && !user) nav({ to: "/login", search: { redirect: "/book" } });
  }, [ready, user, nav]);
  const create = useAction(
    (v: Form) =>
      bookingService.create(user!, {
        serviceIds: cart.items,
        date: v.date,
        time: v.time,
        guests: Number(v.guests),
        specialRequest: v.specialRequest,
      }),
    { success: "Booking submitted", invalidate: [keys.bookings, keys.myBookings(user?.id ?? "")] },
  );
  if (!ready || services.isLoading)
    return (
      <main className="grid min-h-[60vh] place-items-center">
        <Spinner />
      </main>
    );
  if (!user) return null;
  if (!selected.length)
    return (
      <main className="container-spa section-space">
        <EmptyState
          title="Your booking cart is empty"
          text="Choose one or more treatments first."
          action={
            <Button asChild>
              <Link to="/services">Browse services</Link>
            </Button>
          }
        />
      </main>
    );
  return (
    <main className="container-spa section-space">
      <p className="eyebrow mb-3">Your ritual</p>
      <h1 className="display-section">Book your appointment</h1>
      <p className="body-lead mt-5 max-w-3xl text-muted-foreground">
        Choose a preferred date and time, then tell us anything that would help make your visit more
        comfortable. Your request will appear in your dashboard after submission.
      </p>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_minmax(25rem,32rem)] xl:gap-16">
        <div className="space-y-3">
          {selected.map((s) => (
            <div key={s.id} className="surface-card flex items-center justify-between p-5 lg:p-6">
              <div>
                <h2 className="heading-card">{s.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {s.duration} minutes · {money(s.price)}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => cart.remove(s.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <form
          className="surface-card space-y-5 p-6 sm:p-8"
          onSubmit={handleSubmit(async (v) => {
            try {
              await create.mutateAsync(v);
              cart.clear();
              nav({ to: "/dashboard" });
            } catch (error) {
              // The shared mutation already reports the backend error.
              void error;
            }
          })}
        >
          <Field label="Preferred date">
            <Input
              required
              type="date"
              min={new Date().toISOString().slice(0, 10)}
              {...register("date")}
            />
          </Field>
          <Field label="Preferred time">
            <select
              required
              className="flex h-11 w-full rounded-xl border border-input bg-background/60 px-4 text-base shadow-sm focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/30"
              {...register("time")}
            >
              <option value="">Select time</option>
              {content.data?.timeSlots.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field label="Number of guests">
            <Input required type="number" min={1} max={20} {...register("guests")} />
          </Field>
          <Field label="Special request">
            <Textarea maxLength={1000} {...register("specialRequest")} />
          </Field>
          <div className="border-t pt-4">
            <div className="flex justify-between">
              <span>Total</span>
              <b>{money(selected.reduce((n, s) => n + s.price, 0))}</b>
            </div>
            <Button className="mt-4 w-full" disabled={isSubmitting || create.isPending}>
              {create.isPending ? "Submitting…" : "Submit booking"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
