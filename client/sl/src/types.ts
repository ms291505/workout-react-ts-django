// types.ts

export interface ExSet {
  id?: string | number | null;
  order: number | null;
  weightLbs: number | null;
  reps: number | null;
  type: string | null;
}

/**
 * A collection of sets and notes from a workout where a user performaned an Exercise.
 */
export interface Exercise_Hist {
  /** The name of the exercise performed. */
  name: string | null;

  exerciseId?: string | number | null;

  /** The unique id from the exercise_hist table. */
  id?: string | number | null;

  /** User notes about the time this was performed. */
  notes: string | null;

  /** The sets performed. */
  exSets: ExSet[] | null;
}

export interface Workout_Hist {
  name: string | null;
  id?: number | string | null;
  date: string | null;
  notes: string | null;
  exercises: Exercise_Hist[] | null;
}
/**
 * Represents information about an exercise.
 * 
 * Attributes:
 *  name (string | null): The name of the exercise.
 */
export interface Exercise {
  /** The name of the exercise. */
  name: string | null;

  /** The unique id from the exercise table. */
  id: string | number | null;

  /** Indicates if an exercise was created by a user.
   * @remarks
   * Users cannot see exercises created by other users.
   */
  userAddedFlag?: string | null;

}

export interface User {
  id: number | string;
  username: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
}