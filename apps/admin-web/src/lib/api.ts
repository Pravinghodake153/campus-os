// ============================================================
// CampusOS AI — API Client
// Axios instance with auth interceptors
// ============================================================

import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Request interceptor: attach auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("campusos-auth");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const token = parsed?.state?.token;
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch {
          // Invalid stored data, ignore
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 → redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("campusos-auth");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

/** Type-safe API response unwrapper */
export function unwrapResponse<T>(response: { data: { data: T } }): T {
  return response.data.data;
}
