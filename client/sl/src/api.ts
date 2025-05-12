import { Workout, User } from "./types";

const API_BASE = "http://localhost:8000/api";

/**
 * Checks that status of a response.
 * @param response Response
 * @returns Response
 */
async function checkStatus(response: Response) {
  if (!response.ok) {
    const err = new Error(response.statusText);
    throw err;
  }
  return response;
}

export async function login(username: string, password: string): Promise<void> {
  const response = await fetch(`${API_BASE}/token/`, {
    method: "POST",
    credentials: "include",
    headers: {"Content-Type": "Application/json"},
    body: JSON.stringify({ username, password }),
  });
  await checkStatus(response);
}

export async function refreshAccess(): Promise<void> {
  const response = await fetch(`${API_BASE}/token/refresh/`, {
    method: "POST",
    credentials: "include",
  });
  await checkStatus(response);
}

export async function logout(): Promise<void> {
  const response = await fetch(`${API_BASE}/logout/`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Logout failed");
}

export async function fetchWorkouts(): Promise<Workout[]> {
  const response = await fetch(`${API_BASE}/workouts/`, {
    credentials: "include",
  });
  if (response.status === 401) {
    await refreshAccess();
    return fetchWorkouts();
  }
  await checkStatus(response);
  return response.json();
}

export async function whoAmI(): Promise<User> {
  const response = await fetch(`${API_BASE}/whoami/`, {
    credentials: "include",
  });
  if (response.status === 401) {
    await refreshAccess();
    return whoAmI();
  }
  await checkStatus(response);
  return response.json();
}