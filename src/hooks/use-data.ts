import { useMutation, useQuery, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api";
import { bookingService } from "@/services/booking.service";
import {
  contentService,
  galleryService,
  servicesService,
  teamService,
} from "@/services/catalog.service";
import { dashboardService } from "@/services/dashboard.service";
import { userService } from "@/services/user.service";
import { useAuth } from "./use-auth";

export const keys = {
  services: ["services"] as const,
  team: ["team"] as const,
  gallery: ["gallery"] as const,
  content: ["content"] as const,
  bookings: ["bookings"] as const,
  myBookings: (id: string) => ["bookings", "me", id] as const,
  customers: ["customers"] as const,
  dashboard: ["admin-dashboard"] as const,
  adminServices: ["admin-services"] as const,
  adminTeam: ["admin-team"] as const,
  adminGallery: ["admin-gallery"] as const,
};

export const useServices = () =>
  useQuery({ queryKey: keys.services, queryFn: servicesService.list });
export const useTeam = () => useQuery({ queryKey: keys.team, queryFn: teamService.list });
export const useGallery = () => useQuery({ queryKey: keys.gallery, queryFn: galleryService.list });
export const useContent = () =>
  useQuery({
    queryKey: keys.content,
    queryFn: contentService.get,
  });
export const useAllBookings = () =>
  useQuery({ queryKey: keys.bookings, queryFn: () => bookingService.all() });
export const useCustomers = () =>
  useQuery({ queryKey: keys.customers, queryFn: () => userService.list() });
export const useDashboard = () =>
  useQuery({ queryKey: keys.dashboard, queryFn: dashboardService.get });
export const useAdminServices = () =>
  useQuery({ queryKey: keys.adminServices, queryFn: servicesService.listAll });
export const useAdminTeam = () =>
  useQuery({ queryKey: keys.adminTeam, queryFn: teamService.listAll });
export const useAdminGallery = () =>
  useQuery({ queryKey: keys.adminGallery, queryFn: galleryService.listAll });

export function useMyBookings() {
  const { user } = useAuth();
  return useQuery({
    queryKey: keys.myBookings(user?.id ?? ""),
    queryFn: () => bookingService.mine(user?.id ?? ""),
    enabled: !!user,
  });
}

export function useCurrency() {
  const { data } = useContent();
  const c = data?.currency ?? "$";
  return (n: number) => `${c}${n.toLocaleString()}`;
}

/** Mutation wrapper: toast on success/error and invalidate related queries. */
export function useAction<TArgs, TResult>(
  fn: (args: TArgs) => Promise<TResult>,
  opts: { success?: string; invalidate: QueryKey[] },
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      opts.invalidate.forEach((k) => qc.invalidateQueries({ queryKey: k }));
      if (opts.success) toast.success(opts.success);
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}
