const TOKEN_KEY = "safa_token";
const USER_KEY = "safa_username";

export const setToken = (token: string) =>
  localStorage.setItem(TOKEN_KEY, token);
export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

export const setUser = (user: string) => localStorage.setItem(USER_KEY, user);
export const getUser = (): string | null => localStorage.getItem(USER_KEY);
export const removeUser = () => localStorage.removeItem(USER_KEY);
