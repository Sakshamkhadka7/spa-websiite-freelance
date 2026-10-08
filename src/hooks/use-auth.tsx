import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { tokenStorage, userStorage } from "@/lib/api";
import {
  authService,
  type LoginInput,
  type ProfileInput,
  type RegisterInput,
} from "@/services/auth.service";
import type { AuthResponse, User } from "@/types";

interface AuthCtx {
  user: User | null;
  ready: boolean;
  login: (i: LoginInput) => Promise<User>;
  register: (i: RegisterInput) => Promise<User>;
  updateProfile: (i: ProfileInput) => Promise<void>;
  logout: () => void;
  changePassword: (i: { currentPassword: string; newPassword: string }) => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function getStoredUser(): User | null {
  return tokenStorage.get() ? userStorage.get<User>() : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = getStoredUser();
    setUser(stored);
    if (!stored) return setReady(true);
    authService
      .me()
      .then((fresh) => {
        userStorage.set(fresh);
        setUser(fresh);
      })
      .catch(() => {
        tokenStorage.clear();
        setUser(null);
      })
      .finally(() => setReady(true));
  }, []);

  const save = (r: AuthResponse) => {
    tokenStorage.set(r.token);
    userStorage.set(r.user);
    setUser(r.user);
    return r.user;
  };

  const login = useCallback(async (i: LoginInput) => save(await authService.login(i)), []);
  const register = useCallback(async (i: RegisterInput) => save(await authService.register(i)), []);
  const updateProfile = useCallback(
    async (i: ProfileInput) => {
      if (!user) return;
      const u = await authService.updateProfile(user.id, i);
      userStorage.set(u);
      setUser(u);
    },
    [user],
  );
  const logout = useCallback(() => {
    void authService.logout().catch(() => undefined);
    tokenStorage.clear();
    setUser(null);
  }, []);
  const changePassword = useCallback(
    (i: { currentPassword: string; newPassword: string }) => authService.changePassword(i),
    [],
  );

  return (
    <Ctx.Provider value={{ user, ready, login, register, updateProfile, logout, changePassword }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
}
