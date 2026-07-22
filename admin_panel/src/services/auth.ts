/**
 * Real JWT auth against the Express backend (/api/auth).
 */
import { api, unwrap } from "./api";

const TOKEN_KEY = "YRrealty_token";
const USER_KEY = "YRrealty_user";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface BackendAdmin {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export function isAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return !!window.localStorage.getItem(TOKEN_KEY);
}

export function getUser(): AdminUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as AdminUser) : null;
}

export async function login(email: string, password: string, _remember: boolean) {
  const { admin, accessToken } = await unwrap<{ admin: BackendAdmin; accessToken: string }>(
    api.post("/auth/login", { email, password }),
  );
  const user: AdminUser = {
    id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
  };
  window.localStorage.setItem(TOKEN_KEY, accessToken);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  return { token: accessToken, user };
}

export async function changePassword(currentPassword: string, newPassword: string) {
  await api.put("/auth/change-password", { currentPassword, newPassword });
}

export async function forgotPassword(email: string) {
  await api.post("/auth/forgot-password", { email });
}

export async function logout() {
  try {
    await api.post("/auth/logout");
  } catch {
    // clear the local session even if the server call fails
  }
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  window.sessionStorage.removeItem(TOKEN_KEY);
}
