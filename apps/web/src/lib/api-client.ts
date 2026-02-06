import { authClient } from "@/lib/auth-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function apiFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Failed to obtain authentication token");
  }

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${data.token}`);
  headers.set("Content-Type", "application/json");

  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });
}
