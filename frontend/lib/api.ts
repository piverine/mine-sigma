const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";

/**
 * Get the JWT token from localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

/**
 * Get authorization headers with JWT token
 */
export function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export async function getItems() {
  const res = await fetch(`${API_BASE}/items/`);
  if (!res.ok) throw new Error(`Failed to fetch items: ${res.status}`);
  return res.json();
}

export async function getLatestAnalysis() {
  const res = await fetch(`${API_BASE}/analysis/latest`);
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`Failed to fetch latest analysis: ${res.status}`);
  }
  return res.json();
}

export async function getOfficerOverview() {
  const res = await fetch(`${API_BASE}/officer/overview`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch officer overview: ${res.status}`);
  }
  return res.json();
}

export async function login(username: string, password: string) {
  const res = await fetch(`/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as any)?.message ?? (res.status === 401 ? "Invalid credentials" : `Login failed: ${res.status}`));
  }
  return res.json() as Promise<{ username: string; full_name: string; role: "admin" | "officer"; access_token: string; token_type: string }>;
}

export async function getCurrentUser() {
  const token = getAuthToken();
  if (!token) return null;

  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) return null;
  return res.json() as Promise<{ email: string; full_name: string; role: string; is_active: boolean }>;
}