// frontend/src/api/client.ts
import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

export const api = axios.create({
  baseURL,
  withCredentials: false
});

// Мы будем обновлять Authorization из AuthContext
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};
