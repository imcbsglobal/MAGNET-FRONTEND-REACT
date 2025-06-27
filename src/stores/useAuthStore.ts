import { create } from "zustand";
import {
  getToken,
  getUser,
  setToken as saveToken,
  setUser as saveUser,
  removeToken,
  removeUser,
} from "../utils/token";

interface AuthState {
  token: string | null;
  user: string | null;
  setToken: (token: string) => void;
  setUser: (user: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: getToken(),
  user: getUser(),

  setToken: (token) => {
    saveToken(token);
    set({ token });
  },

  setUser: (user) => {
    saveUser(user);
    set({ user });
  },

  logout: () => {
    removeToken();
    removeUser();
    set({ token: null, user: null });
  },
}));
