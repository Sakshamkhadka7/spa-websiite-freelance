export type Role = "customer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  duration: number;
  price: number;
  image: string;
  active: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  specialization: string;
  experience: number;
  bio: string;
  image: string;
  active: boolean;
}

export interface GalleryItem {
  id: string;
  image: string;
  title: string;
  caption: string;
  category: string;
  visible: boolean;
}

export type BookingStatus = "pending" | "contacted" | "confirmed" | "completed" | "cancelled";
export type PaymentStatus = "paid" | "unpaid";

export interface BookingServiceItem {
  serviceId: string;
  name: string;
  price: number;
  duration: number;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  userId: string;
  customer: { name: string; email: string; phone: string };
  services: BookingServiceItem[];
  date: string;
  time: string;
  guests: number;
  totalPrice: number;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  specialRequest: string;
  internalNotes: string;
  createdAt: string;
}

export interface CreateBookingInput {
  serviceIds: string[];
  date: string;
  time: string;
  guests: number;
  specialRequest: string;
}

export interface OpeningHour {
  day: string;
  hours: string;
}

export interface SiteContent {
  spaName: string;
  logoText: string;
  logo: string;
  tagline: string;
  hero: { title: string; subtitle: string; image: string };
  about: { story: string; mission: string; values: string[]; facilities: string[] };
  contact: { phone: string; email: string; address: string };
  openingHours: OpeningHour[];
  social: { facebook: string; instagram: string; twitter: string };
  footerText: string;
  currency: string;
  timeSlots: string[];
}

export interface Customer extends User {
  bookingCount: number;
  totalSpent: number;
  lastBooking?: string | null;
}

export interface DashboardStats {
  totalCustomers: number;
  totalBookings: number;
  todayBookings: number;
  pending: number;
  contacted: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  paid: number;
  unpaid: number;
  recentBookings: Booking[];
  upcomingAppointments: Booking[];
}

export interface CustomerDetails {
  customer: User;
  bookings: Booking[];
  totalBookings: number;
  lastBooking: Booking | null;
}

/** Image value in forms: either an existing URL or a newly picked file. */
export type ImageInput = string | File;
