import { api } from "@/lib/api";
import type { Booking, BookingStatus, CreateBookingInput, PaymentStatus, User } from "@/types";

export interface BookingUpdate {
  bookingStatus?: BookingStatus;
  paymentStatus?: PaymentStatus;
  date?: string;
  time?: string;
  internalNotes?: string;
}
export const bookingService = {
  async create(_user: User, input: CreateBookingInput): Promise<Booking> {
    return (await api.post<Booking>("/bookings", input)).data;
  },
  async mine(_userId: string): Promise<Booking[]> {
    return (await api.get<Booking[]>("/bookings/me", { params: { limit: 100 } })).data;
  },
  async getMine(id: string): Promise<Booking> {
    return (await api.get<Booking>(`/bookings/me/${id}`)).data;
  },
  async cancelMine(id: string): Promise<Booking> {
    return (await api.patch<Booking>(`/bookings/me/${id}/cancel`)).data;
  },
  async all(params?: Record<string, string | number>): Promise<Booking[]> {
    return (await api.get<Booking[]>("/bookings", { params: { limit: 100, ...params } })).data;
  },
  async get(id: string): Promise<Booking> {
    return (await api.get<Booking>(`/bookings/${id}`)).data;
  },
  async update(id: string, patch: BookingUpdate): Promise<Booking> {
    return (await api.patch<Booking>(`/bookings/${id}`, patch)).data;
  },
  async remove(id: string): Promise<void> {
    await api.delete(`/bookings/${id}`);
  },
};
