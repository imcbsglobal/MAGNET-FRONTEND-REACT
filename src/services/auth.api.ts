import api from "./axios";
import type { LoginRequest, LoginResponse } from "../types/auth.types";

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>("/school/login/", data);
  return res.data;
};
