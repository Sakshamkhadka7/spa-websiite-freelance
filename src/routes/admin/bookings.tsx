import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Eye, Trash2 } from "lucide-react";
import { AdminPage } from "@/components/admin-shell";
import { ConfirmDialog, EmptyState, PaymentBadge, Spinner, StatusBadge } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAction, useAllBookings, useCurrency, keys } from "@/hooks/use-data";
import { bookingService } from "@/services/booking.service";
import type { Booking, BookingStatus, PaymentStatus } from "@/types";
export const Route = createFileRoute("/admin/bookings")({ component: Bookings });
function Bookings() {
  const q = useAllBookings();
  const money = useCurrency();
  const [selected, setSelected] = useState<Booking | null>(null);
  const update = useAction(
    ({ id, patch }: { id: string; patch: Parameters<typeof bookingService.update>[1] }) =>
      bookingService.update(id, patch),
    { success: "Booking updated", invalidate: [keys.bookings, keys.dashboard] },
  );
  const remove = useAction((id: string) => bookingService.remove(id), {
    success: "Booking deleted",
    invalidate: [keys.bookings, keys.dashboard],
  });
  if (q.isLoading) return <Spinner />;
  return (
    <AdminPage
      title="Bookings"
      description="Manage appointments, internal status and direct-payment records."
    >
      {!q.data?.length ? (
        <EmptyState title="No bookings" />
      ) : (
        <div className="surface-card overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-sm">
            <thead className="bg-muted/60">
              <tr>
                {[
                  "Booking",
                  "Customer",
                  "Services",
                  "Price",
                  "Appointment",
                  "Guests",
                  "Status",
                  "Payment",
                  "Actions",
                ].map((x) => (
                  <th key={x} className="px-4 py-3 font-medium">
                    {x}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {q.data.map((b) => (
                <tr key={b.id} className="border-t">
                  <td className="px-4 py-3 font-medium">{b.bookingNumber}</td>
                  <td className="px-4 py-3">
                    {b.customer?.name}
                    <br />
                    <span className="text-xs text-muted-foreground">{b.customer?.phone}</span>
                  </td>
                  <td className="max-w-52 px-4 py-3">{b.services.map((s) => s.name).join(", ")}</td>
                  <td className="px-4 py-3">{money(b.totalPrice)}</td>
                  <td className="px-4 py-3">
                    {b.date}
                    <br />
                    {b.time}
                  </td>
                  <td className="px-4 py-3">{b.guests}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={b.bookingStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <PaymentBadge status={b.paymentStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => setSelected(b)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <ConfirmDialog
                        trigger={
                          <Button size="icon" variant="ghost">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        }
                        title="Delete booking?"
                        text="This cannot be undone."
                        onConfirm={() => remove.mutate(b.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selected && (
        <BookingDialog
          booking={selected}
          close={() => setSelected(null)}
          save={(patch) =>
            update.mutate({ id: selected.id, patch }, { onSuccess: (b) => setSelected(b) })
          }
        />
      )}
    </AdminPage>
  );
}
function BookingDialog({
  booking: b,
  close,
  save,
}: {
  booking: Booking;
  close: () => void;
  save: (p: {
    bookingStatus: BookingStatus;
    paymentStatus: PaymentStatus;
    date: string;
    time: string;
    internalNotes: string;
  }) => void;
}) {
  const [status, setStatus] = useState(b.bookingStatus),
    [payment, setPayment] = useState(b.paymentStatus),
    [date, setDate] = useState(b.date),
    [time, setTime] = useState(b.time),
    [notes, setNotes] = useState(b.internalNotes);
  return (
    <Dialog open onOpenChange={close}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{b.bookingNumber}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm">
            Booking status
            <Select value={status} onValueChange={(v) => setStatus(v as BookingStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["pending", "contacted", "confirmed", "completed", "cancelled"].map((x) => (
                  <SelectItem key={x} value={x}>
                    {x}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
          <label className="text-sm">
            Payment status
            <Select value={payment} onValueChange={(v) => setPayment(v as PaymentStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </label>
          <label className="text-sm">
            Date
            <Input
              type="date"
              value={date.slice(0, 10)}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          <label className="text-sm">
            Time
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </label>
          <label className="text-sm sm:col-span-2">
            Internal notes
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={2000} />
          </label>
        </div>
        <Button
          onClick={() =>
            save({
              bookingStatus: status,
              paymentStatus: payment,
              date,
              time,
              internalNotes: notes,
            })
          }
        >
          Save changes
        </Button>
      </DialogContent>
    </Dialog>
  );
}
