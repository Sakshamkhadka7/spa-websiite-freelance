import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState, PaymentBadge, Spinner, StatusBadge } from "@/components/shared";
import { useAuth } from "@/hooks/use-auth";
import { keys, useAction, useCurrency, useMyBookings } from "@/hooks/use-data";
import { bookingService } from "@/services/booking.service";
import { getErrorMessage } from "@/lib/api";
export const Route = createFileRoute("/dashboard")({ component: CustomerDashboard });
function CustomerDashboard() {
  const auth = useAuth(),
    nav = useNavigate(),
    q = useMyBookings(),
    money = useCurrency();
  const [name, setName] = useState(auth.user?.name ?? ""),
    [phone, setPhone] = useState(auth.user?.phone ?? "");
  const [currentPassword, setCurrent] = useState(""),
    [newPassword, setNew] = useState("");
  useEffect(() => {
    if (auth.ready && !auth.user) nav({ to: "/login", search: { redirect: "/dashboard" } });
    else if (auth.user?.role === "admin") nav({ to: "/admin" });
  }, [auth.ready, auth.user, nav]);
  const cancel = useAction((id: string) => bookingService.cancelMine(id), {
    success: "Booking cancelled",
    invalidate: [keys.myBookings(auth.user?.id ?? "")],
  });
  if (!auth.ready || !auth.user)
    return (
      <div className="grid min-h-screen place-items-center">
        <Spinner />
      </div>
    );
  return (
    <main className="container-spa section-space">
      <div className="flex flex-wrap items-end justify-between">
        <div>
          <p className="eyebrow">Customer account</p>
          <h1 className="display-section mt-2">Welcome, {auth.user.name.split(" ")[0]}</h1>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            auth.logout();
            nav({ to: "/" });
          }}
        >
          Logout
        </Button>
      </div>
      <Tabs defaultValue="overview" className="mt-10">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Total bookings", q.data?.length ?? 0],
              [
                "Upcoming",
                q.data?.filter((b) =>
                  ["pending", "contacted", "confirmed"].includes(b.bookingStatus),
                ).length ?? 0,
              ],
              ["Completed", q.data?.filter((b) => b.bookingStatus === "completed").length ?? 0],
            ].map(([l, v]) => (
              <div className="surface-card p-6 lg:p-7" key={l}>
                <p className="text-sm text-muted-foreground">{l}</p>
                <p className="mt-2 font-display text-[clamp(2.25rem,3vw,3.5rem)]">{v}</p>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="bookings" className="mt-6">
          {q.isLoading ? (
            <Spinner />
          ) : !q.data?.length ? (
            <EmptyState title="No bookings yet" />
          ) : (
            <div className="space-y-4">
              {q.data.map((b) => (
                <div className="surface-card p-5 lg:p-6" key={b.id}>
                  <div className="flex flex-wrap justify-between gap-3">
                    <div>
                      <h2 className="heading-card">{b.bookingNumber}</h2>
                      <p className="text-sm text-muted-foreground">
                        {b.services.map((s) => s.name).join(", ")}
                      </p>
                      <p className="mt-2">
                        {b.date} at {b.time} · {b.guests} guest(s) · {money(b.totalPrice)}
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <StatusBadge status={b.bookingStatus} />
                      <PaymentBadge status={b.paymentStatus} />
                    </div>
                  </div>
                  {b.bookingStatus === "pending" && (
                    <Button
                      className="mt-4"
                      size="sm"
                      variant="outline"
                      onClick={() => cancel.mutate(b.id)}
                    >
                      Cancel booking
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="profile" className="mt-6 grid gap-6 md:grid-cols-2">
          <form
            className="surface-card space-y-4 p-6 lg:p-8"
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                await auth.updateProfile({ name, phone });
                toast.success("Profile updated");
              } catch (x) {
                toast.error(getErrorMessage(x));
              }
            }}
          >
            <h2 className="heading-card">Profile details</h2>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
            <Input value={auth.user.email} disabled />
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
            <Button>Save profile</Button>
          </form>
          <form
            className="surface-card space-y-4 p-6 lg:p-8"
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                await auth.changePassword({ currentPassword, newPassword });
                setCurrent("");
                setNew("");
                toast.success("Password changed");
              } catch (x) {
                toast.error(getErrorMessage(x));
              }
            }}
          >
            <h2 className="heading-card">Change password</h2>
            <Input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrent(e.target.value)}
              required
            />
            <Input
              type="password"
              minLength={8}
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNew(e.target.value)}
              required
            />
            <Button>Change password</Button>
          </form>
        </TabsContent>
      </Tabs>
    </main>
  );
}
