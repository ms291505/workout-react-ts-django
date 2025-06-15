import {
  Workout_Hist,
  User,
  Exercise,
  UserRegisterDto,
  Choice } from "./library/types";

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

export async function register(payload: UserRegisterDto): Promise<void | Response> {
  const response = await fetch(`${API_BASE}/user/register/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "Application/json",
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
  const response = await fetch(`${API_BASE}/exset-types`, {
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

export async function fetchWorkoutDetail( workoutID: number): Promise<Workout_Hist> {
  const response = await fetch(`${API_BASE}/workouts/${workoutID}/`, {
    credentials: "include",
    headers: {
      "Content-Type": "Application/json",
    }
  });
  if (response.status === 401) {
    await refreshAccess();
    return fetchWorkoutDetail(workoutID);
  }
  await checkStatus(response);
  return response.json();
}

export async function postWorkout(workout: Workout_Hist): Promise<void> {
  const response = await fetch(`${API_BASE}/workouts/`, {
    method: "POST",
    credentials: "include",
    headers: {"Content-Type": "Application/json"},
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

    return;
  }
}

export async function updateWorkout(workout: Workout_Hist): Promise<Workout_Hist> {
  const response = await fetch(`${API_BASE}/workouts/${workout.id!}/`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "Application/json",
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
  const response = await fetch(`${API_BASE}/exercises/`, {
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
    headers: {"Content-Type": "Application/json"},
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