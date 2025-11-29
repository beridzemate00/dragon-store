import { api } from "./client";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "STAFF";
  storeIds: string[];
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export const loginRequest = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};
