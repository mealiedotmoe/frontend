export const API_BASE = process.env.NEXT_PUBLIC_API_HOST;

export async function apiFetch<T>(uri: string, method: "GET" | "PUT" | "POST" | "DELETE", data?: Record<string, unknown>): Promise<T> {
  const httpOptions: RequestInit = {
    method,
    headers: {},
    credentials: "include"
  };
  if (data) {
    httpOptions.body = JSON.stringify(data);
  }
  const response = await fetch(`${API_BASE}${uri}`, httpOptions);
  if (response.status !== 200) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return response.json();
}