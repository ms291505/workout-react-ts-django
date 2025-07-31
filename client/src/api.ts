// api.ts

import {
  Workout_Hist,
  User,
  Exercise,
  UserRegisterDto,
  Choice,
  TmplWorkoutHist,
  TmplHist
} from "./library/types";
import { API_BASE } from "./library/constants";

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

/**
 * Helper function for handling API errors. 
 * @param response - The `Response` object from a failed catch call.
 * @throws {Error} - With a message extracted from the response body.
 */
async function handleApiError(response: Response): Promise<never> {
  let userMessage = `Request failed with status ${response.status}`;
  let debugInfo: any = null;

  try {
    const data = await response.json();
    debugInfo = data;

    if (typeof data === "string") {
      userMessage = data;
    } else if (data?.detail) {
      userMessage = data.detail;
    } else if (typeof data === "object") {
      // Likely validation errors
      const errors = Object.entries(data)
        .map(([field, messages]) => `${field}: ${(messages as string[]).join(", ")}`)
        .join(" | ");
      userMessage = errors || userMessage;
    }
  } catch (e) {
    userMessage = response.statusText || "Unknown error occurred";
  }

  console.error("API error response:", {
    url: response.url,
    status: response.status,
    statusText: response.statusText,
    body: debugInfo,
  });

  throw new Error(userMessage);
}


export async function login(username: string, password: string): Promise<void> {
  const response = await fetch(`${API_BASE}/token/`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    await handleApiError(response);
  }
}

export async function refreshAccess(): Promise<void> {
  const response = await fetch(`${API_BASE}/token/refresh/`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) await handleApiError(response);
}

export async function logout(): Promise<void> {
  const response = await fetch(`${API_BASE}/logout/`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) await handleApiError(response);
}

export async function register(payload: UserRegisterDto): Promise<void | Response> {
  const response = await fetch(`${API_BASE}/user/register/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    console.error("Submit failed:", response.status);

    const errors = await response.json();
    console.error("Validation errors:", errors)

    return response;
  } else {
    return response;
  }
}

export async function fetchSetTypeChoice(): Promise<Choice[]> {
  const response = await fetch(`${API_BASE}/exset-types/`, {
    credentials: "include",
  });
  if (response.status === 401) {
    await refreshAccess();
    return fetchSetTypeChoice();
  }
  await checkStatus(response);
  return response.json();
}

export async function fetchWorkouts(): Promise<Workout_Hist[]> {
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

export async function fetchTemplateHists(
  param: string = "",
  value: string | number = ""
): Promise<TmplHist[]> {
  let url = `${API_BASE}/tmpl-hist/`;

  if (param && value !== "") {
    url += `?${param}=${encodeURIComponent(value)}`;
  }

  const response = await fetch(url, {
    credentials: "include",
  });

  if (response.status === 401) {
    await refreshAccess();
    return fetchTemplateHists(param, value);
  }

  if (!response.ok) await handleApiError(response);

  await checkStatus(response);
  return response.json();
}

export async function fetchTemplateByWorkout(
  workout_id: string | number
): Promise<TmplWorkoutHist[]> {

  let url = `${API_BASE}/tmpl-workouts/`;

  url += `?workout_id=${encodeURIComponent(workout_id.toString())}`;

  const response = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    }
  });

  if (response.status === 401) {
    await refreshAccess();
    return fetchTemplateByWorkout(workout_id);
  }

  if (!response.ok) await handleApiError(response);

  await checkStatus(response);
  return response.json();
}

export async function fetchWorkoutDetail(workoutID: number): Promise<Workout_Hist> {
  const response = await fetch(`${API_BASE}/workouts/${workoutID}/`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    }
  });
  if (response.status === 401) {
    await refreshAccess();
    return fetchWorkoutDetail(workoutID);
  }
  await checkStatus(response);
  return response.json();
}

export async function postWorkout(workout: Workout_Hist): Promise<Workout_Hist> {
  const response = await fetch(`${API_BASE}/workouts/`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(workout),
  });
  if (response.status === 401) {
    await refreshAccess();
    return postWorkout(workout);
  }
  if (!response.ok) {
    console.error("Submit failed:", response.status);

    const errors = await response.json();
    console.error("Validation errors:", errors)

    throw errors;
  }
  await checkStatus(response);
  return response.json();
}

export async function postTemplate(workout: TmplWorkoutHist): Promise<TmplWorkoutHist> {
  const response = await fetch(`${API_BASE}/tmpl-workouts/`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(workout),
  });
  if (response.status === 401) {
    await refreshAccess();
    return postTemplate(workout);
  }
  if (!response.ok) handleApiError(response);

  await checkStatus(response);
  return response.json();
}

export async function postTemplateHist(tmplHist: TmplHist): Promise<boolean> {
  const response = await fetch(`${API_BASE}/tmpl-hist/`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tmplHist),
  })

  if (response.status === 401) {
    await refreshAccess();
    return postTemplateHist(tmplHist);
  }
  if (!response.ok) handleApiError(response);

  await checkStatus(response);
  return true;
}

export async function deleteWorkout(workout: Workout_Hist): Promise<boolean> {
  const response = await fetch(`${API_BASE}/workouts/delete/${workout.id!}/`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status === 401) {
    await refreshAccess();
    return deleteWorkout(workout);
  }

  if (!response.ok) {
    console.error("Delete failed:", response.status);

    try {
      const errorData = await response.json();
      console.error("Validation errors:", errorData);
      throw errorData;
    } catch {
      throw new Error("Unknown error deleting workout");
    }
  }

  await checkStatus(response);
  return true;
}

export async function deleteTemplate(template: TmplWorkoutHist): Promise<boolean> {
  if (!template.id) throw "Template does not have an ID.";
  const response = await fetch(`${API_BASE}/tmpl-workouts/${template.id}/`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status === 401) {
    await refreshAccess();
    return deleteTemplate(template);
  }

  if (!response.ok) handleApiError(response);

  await checkStatus(response);
  return true;
}

export async function updateWorkout(workout: Workout_Hist): Promise<Workout_Hist> {
  const response = await fetch(`${API_BASE}/workouts/${workout.id!}/`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(workout),
  });
  if (response.status === 401) {
    await refreshAccess();
    return updateWorkout(workout);
  }
  if (!response.ok) {
    console.error("Submit failed:", response.status);

    const errorData = await response.json();
    console.error("Validation errors:", errorData)

    throw errorData;
  }
  await checkStatus(response);
  return response.json();
}

export async function fetchExercises(): Promise<Exercise[]> {
  const response = await fetch(`${API_BASE}/exercises/?days=30`, {
    credentials: "include",
  });
  if (response.status === 401) {
    await refreshAccess();
    return fetchExercises();
  }
  await checkStatus(response);
  return response.json();
}

export async function fetchExercisesByName(inputValue: string): Promise<Exercise[]> {
  const response = await fetch(
    `${API_BASE}/exercises/?search=${encodeURIComponent(inputValue)}`, {
    credentials: "include"
  });
  if (response.status === 401) {
    await refreshAccess();
    return fetchExercisesByName(inputValue);
  }
  await checkStatus(response);
  return response.json();
}

export async function postExercise(inputValue: string): Promise<Exercise> {
  const response = await fetch(`${API_BASE}/exercises/`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: inputValue }),
  });
  if (response.status === 401) {
    await refreshAccess();
    return postExercise(inputValue);
  } else if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
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
