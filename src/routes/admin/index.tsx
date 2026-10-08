import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheck, CalendarDays, CircleDollarSign, Clock3, Users } from "lucide-react";
import { AdminPage } from "@/components/admin-shell";
import { EmptyState, PaymentBadge, Spinner, StatusBadge } from "@/components/shared";
import { useDashboard, useCurrency } from "@/hooks/use-data";
export const Route = createFileRoute("/admin/")({ component: Dashboard });
function Dashboard() {
  const q = useDashboard();
  const money = useCurrency();
  if (q.isLoading) return <Spinner />;
  if (q.isError)
    return (
      <EmptyState
        title="Dashboard unavailable"
        text="Check that the API and MongoDB are running."
      />
    );
  const d = q.data!;
  const cards = [
    ["Total Customers", d.totalCustomers, Users],
    ["Total Bookings", d.totalBookings, CalendarDays],
    ["Today's Bookings", d.todayBookings, CalendarCheck],
    ["Pending", d.pending, Clock3],
    ["Contacted", d.contacted, Clock3],
    ["Confirmed", d.confirmed, CalendarCheck],
    ["Completed", d.completed, CalendarCheck],
    ["Cancelled", d.cancelled, CalendarDays],
    ["Paid", d.paid, CircleDollarSign],
    ["Unpaid", d.unpaid, CircleDollarSign],
  ] as const;
  return (
    <AdminPage title="Dashboard" description="A live overview of your spa operations.">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map(([l, v, I]) => (
          <div key={l} className="surface-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{l}</p>
              <I className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-3 font-display text-[2.25rem] font-medium">{v}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <BookingList title="Recent Bookings" items={d.recentBookings} money={money} />
        <BookingList title="Upcoming Appointments" items={d.upcomingAppointments} money={money} />
      </div>
    </AdminPage>
  );
}
function BookingList({
  title,
  items,
  money,
}: {
  title: string;
  items: import("@/types").Booking[];
  money: (n: number) => string;
}) {
  return (
    <section className="surface-card p-5 lg:p-6">
      <h2 className="heading-card">{title}</h2>
      <div className="mt-4 space-y-3">
        {items.length ? (
          items.map((b) => (
            <div
              key={b.id}
              className="flex flex-wrap items-center justify-between gap-2 border-b pb-3 text-sm"
            >
              <div>
                <p className="font-medium">
                  {b.bookingNumber} · {b.customer?.name}
                </p>
                <p className="text-muted-foreground">
                  {b.date} at {b.time} · {money(b.totalPrice)}
                </p>
              </div>
              <div className="flex gap-2">
                <StatusBadge status={b.bookingStatus} />
                <PaymentBadge status={b.paymentStatus} />
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No bookings yet.</p>
        )}
      </div>
    </section>
  );
}
