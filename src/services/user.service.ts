import { api } from "@/lib/api";
import type { Customer, CustomerDetails } from "@/types";
export const userService = {
  async list(search = ""): Promise<Customer[]> {
    return (await api.get<Customer[]>("/users", { params: { search, limit: 100 } })).data;
  },
  async get(id: string): Promise<CustomerDetails> {
    return (await api.get<CustomerDetails>(`/users/${id}`)).data;
  },
};
