import { authClient } from "./auth-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

async function apiFetch(endpoint: string, options?: RequestInit) {
  const tokenData = await authClient.token();
  const token = tokenData?.data?.token;

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options?.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Something went wrong");
  }

  return response.json();
}

// Example API client functions (add more as needed)
export const api = {
  getTasks: async (status?: string, sort?: string) => {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (sort) params.append("sort", sort);
    const queryString = params.toString();
    return apiFetch(`/tasks${queryString ? `?${queryString}` : ""}`);
  },

  createTask: async (title: string, description?: string) => {
    return apiFetch("/tasks", {
      method: "POST",
      body: JSON.stringify({ title, description }),
    });
  },

  getTask: async (id: number) => {
    return apiFetch(`/tasks/${id}`);
  },

  updateTask: async (id: number, title?: string, description?: string, completed?: boolean) => {
    return apiFetch(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify({ title, description, completed }),
    });
  },

  deleteTask: async (id: number) => {
    return apiFetch(`/tasks/${id}`, {
      method: "DELETE",
    });
  },

  toggleCompleteTask: async (id: number) => {
    return apiFetch(`/tasks/${id}/complete`, {
      method: "PATCH",
    });
  },
};
