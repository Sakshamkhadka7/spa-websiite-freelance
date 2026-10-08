import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AdminPage } from "@/components/admin-shell";
import { EmptyState, Spinner, StatusBadge } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/hooks/use-data";
import { userService } from "@/services/user.service";
import type { Customer } from "@/types";
export const Route = createFileRoute("/admin/customers")({ component: Customers });
function Customers() {
  const [search, setSearch] = useState("");
  const [picked, setPicked] = useState<Customer | null>(null);
  const q = useQuery({ queryKey: ["customers", search], queryFn: () => userService.list(search) });
  const details = useQuery({
    queryKey: ["customer", picked?.id],
    queryFn: () => userService.get(picked!.id),
    enabled: !!picked,
  });
  const money = useCurrency();
  return (
    <AdminPage
      title="Customers"
      description="Registered customers and their booking history."
      action={
        <Input
          className="w-64"
          placeholder="Search name, email or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      }
    >
      {q.isLoading ? (
        <Spinner />
      ) : !q.data?.length ? (
        <EmptyState title="No customers found" />
      ) : (
        <div className="surface-card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/60">
              <tr>
                {["Customer", "Phone", "Joined", "Bookings", "Last booking", "Spent", ""].map(
                  (x) => (
                    <th key={x} className="px-4 py-3">
                      {x}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {q.data.map((c) => (
                <tr className="border-t" key={c.id}>
                  <td className="px-4 py-3">
                    <b>{c.name}</b>
                    <br />
                    <span className="text-muted-foreground">{c.email}</span>
                  </td>
                  <td className="px-4 py-3">{c.phone}</td>
                  <td className="px-4 py-3">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{c.bookingCount}</td>
                  <td className="px-4 py-3">
                    {c.lastBooking ? new Date(c.lastBooking).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3">{money(c.totalSpent)}</td>
                  <td>
                    <Button variant="outline" size="sm" onClick={() => setPicked(c)}>
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {picked && (
        <Dialog open onOpenChange={() => setPicked(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{picked.name}</DialogTitle>
            </DialogHeader>
            {details.isLoading ? (
              <Spinner />
            ) : (
              <div className="max-h-[60vh] space-y-3 overflow-auto">
                {details.data?.bookings.map((b) => (
                  <div key={b.id} className="flex justify-between rounded border p-3 text-sm">
                    <div>
                      <b>{b.bookingNumber}</b>
                      <p>{b.services.map((s) => s.name).join(", ")}</p>
                      <p className="text-muted-foreground">
                        {b.date} · {b.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={b.bookingStatus} />
                      <p className="mt-1">{money(b.totalPrice)}</p>
                    </div>
                  </div>
                )) || <EmptyState title="No bookings" />}
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </AdminPage>
  );
}
