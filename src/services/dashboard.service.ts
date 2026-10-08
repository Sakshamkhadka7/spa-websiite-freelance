import { api } from "@/lib/api";
import type { DashboardStats } from "@/types";
export const dashboardService = {
  async get(): Promise<DashboardStats> {
    return (await api.get<DashboardStats>("/dashboard")).data;
  },
};
