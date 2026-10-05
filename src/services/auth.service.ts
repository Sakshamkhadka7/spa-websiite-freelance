import { api, USE_MOCK } from "@/lib/api";
import { db, delay, persist, uid } from "@/lib/mock-db";
import type { AuthResponse, User } from "@/types";

export interface RegisterInput { name: string; email: string; phone: string; password: string }
export interface LoginInput { email: string; password: string }
export interface ProfileInput { name: string; phone: string }

const strip = ({ password: _p, ...u }: User & { password: string }): User => u;

export const authService = {
  // POST /auth/login
  async login(input: LoginInput): Promise<AuthResponse> {
    if (!USE_MOCK) return (await api.post<AuthResponse>("/auth/login", input)).data;
    await delay();
    const u = db().users.find((x) => x.email.toLowerCase() === input.email.toLowerCase());
    if (!u || u.password !== input.password) throw new Error("Invalid email or password");
    return { token: `mock.${u.id}`, user: strip(u) };
  },
  // POST /auth/register
  async register(input: RegisterInput): Promise<AuthResponse> {
    if (!USE_MOCK) return (await api.post<AuthResponse>("/auth/register", input)).data;
    await delay();
    const d = db();
    if (d.users.some((x) => x.email.toLowerCase() === input.email.toLowerCase())) throw new Error("An account with this email already exists");
    const u = { ...input, id: uid(), role: "customer" as const, createdAt: new Date().toISOString() };
    d.users.push(u);
    persist();
    return { token: `mock.${u.id}`, user: strip(u) };
  },
  // PUT /auth/profile
  async updateProfile(userId: string, input: ProfileInput): Promise<User> {
    if (!USE_MOCK) return (await api.put<User>("/auth/profile", input)).data;
    await delay();
    const u = db().users.find((x) => x.id === userId);
    if (!u) throw new Error("User not found");
    Object.assign(u, input);
    db().bookings.forEach((b) => { if (b.userId === userId) b.customer = { ...b.customer, ...input }; });
    persist();
    return strip(u);
  },
};
