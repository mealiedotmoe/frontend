import { APIError } from "./api-return-types";

export const API_BASE = "http://localhost:8810/api/v2";

export async function apiFetch<T>(uri: string, method: "GET" | "PUT" | "POST", data?: any): Promise<T|APIError> {
  const httpOptions: RequestInit = {
    method,
    headers: {},
  };
  if (data) {
    httpOptions.body = JSON.stringify(data);
  }
  const response = await fetch(`${API_BASE}${uri}`, httpOptions);
  return response.json();
}