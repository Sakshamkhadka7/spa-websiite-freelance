import { api } from "@/lib/api";
import type { AuthResponse, User } from "@/types";

export interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  password: string;
}
export interface LoginInput {
  email: string;
  password: string;
}
export interface ProfileInput {
  name: string;
  phone: string;
}

export const authService = {
  // POST /auth/login
  async login(input: LoginInput): Promise<AuthResponse> {
    return (await api.post<AuthResponse>("/auth/login", input)).data;
  },
  // POST /auth/register
  async register(input: RegisterInput): Promise<AuthResponse> {
    return (await api.post<AuthResponse>("/auth/register", input)).data;
  },
  // PUT /auth/profile
  async updateProfile(_userId: string, input: ProfileInput): Promise<User> {
    return (await api.put<User>("/auth/profile", input)).data;
  },
  async me(): Promise<User> {
    return (await api.get<User>("/auth/me")).data;
  },
  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },
  async changePassword(input: { currentPassword: string; newPassword: string }): Promise<void> {
    await api.patch("/auth/change-password", input);
  },
};
