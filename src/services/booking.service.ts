import { api, USE_MOCK } from "@/lib/api";
import { db, delay, persist, uid } from "@/lib/mock-db";
import type { Booking, BookingStatus, CreateBookingInput, Customer, PaymentStatus, User } from "@/types";

export interface BookingUpdate {
  bookingStatus?: BookingStatus;
  paymentStatus?: PaymentStatus;
  date?: string;
  time?: string;
  internalNotes?: string;
}

export const bookingService = {
  // POST /bookings  (user taken from JWT on the server)
  async create(user: User, input: CreateBookingInput): Promise<Booking> {
    if (!USE_MOCK) return (await api.post<Booking>("/bookings", input)).data;
    await delay(500);
    const d = db();
    const services = d.services
      .filter((s) => input.serviceIds.includes(s.id))
      .map((s) => ({ serviceId: s.id, name: s.name, price: s.price, duration: s.duration }));
    if (!services.length) throw new Error("Please add at least one service");
    const booking: Booking = {
      id: uid(),
      bookingNumber: `SPA-${Date.now().toString().slice(-6)}`,
      userId: user.id,
      customer: { name: user.name, email: user.email, phone: user.phone },
      services,
      date: input.date,
      time: input.time,
      guests: input.guests,
      totalPrice: services.reduce((a, s) => a + s.price, 0) * input.guests,
      bookingStatus: "pending",
      paymentStatus: "unpaid",
      specialRequest: input.specialRequest,
      internalNotes: "",
      createdAt: new Date().toISOString(),
    };
    d.bookings.unshift(booking);
    persist();
    return booking;
  },
  // GET /bookings/me
  async mine(userId: string): Promise<Booking[]> {
    if (!USE_MOCK) return (await api.get<Booking[]>("/bookings/me")).data;
    await delay();
    return db().bookings.filter((b) => b.userId === userId);
  },
  // GET /admin/bookings
  async all(): Promise<Booking[]> {
    if (!USE_MOCK) return (await api.get<Booking[]>("/admin/bookings")).data;
    await delay();
    return [...db().bookings];
  },
  // PATCH /admin/bookings/:id
  async update(id: string, patch: BookingUpdate): Promise<Booking> {
    if (!USE_MOCK) return (await api.patch<Booking>(`/admin/bookings/${id}`, patch)).data;
    await delay();
    const b = db().bookings.find((x) => x.id === id);
    if (!b) throw new Error("Booking not found");
    Object.assign(b, patch);
    persist();
    return b;
  },
  // DELETE /admin/bookings/:id
  async remove(id: string): Promise<void> {
    if (!USE_MOCK) { await api.delete(`/admin/bookings/${id}`); return; }
    await delay();
    const d = db();
    d.bookings = d.bookings.filter((b) => b.id !== id);
    persist();
  },
  // GET /admin/customers
  async customers(): Promise<Customer[]> {
    if (!USE_MOCK) return (await api.get<Customer[]>("/admin/customers")).data;
    await delay();
    const d = db();
    return d.users
      .filter((u) => u.role === "customer")
      .map(({ password: _p, ...u }) => {
        const mine = d.bookings.filter((b) => b.userId === u.id);
        return {
          ...u,
          bookingCount: mine.length,
          totalSpent: mine.filter((b) => b.paymentStatus === "paid").reduce((a, b) => a + b.totalPrice, 0),
        };
      });
  },
};
