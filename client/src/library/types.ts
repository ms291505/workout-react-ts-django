
export interface Choice {
  value: string;
  label: string;
}

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
  name?: string | null;

  exerciseId?: string | number | null;

  /** The unique id from the exercise_hist table. */
  id?: string | number | null;

  /** User notes about the time this was performed. */
  notes?: string | null;

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

export interface TmplExSet extends ExSet { }

export interface TmplExerciseHist extends Omit<Exercise_Hist, "exSets"> {
  tmplExSets: TmplExSet[];
}

export interface TmplWorkoutHist extends Omit<Workout_Hist, "date" | "exercises"> {
  tmplExercises: TmplExerciseHist[];
}

export interface TmplHist {
  id: string | number | null;
  workoutHist: string | number;
  tmplWorkoutHist: string | number;
}

/**
 * Represents information about an exercise.
 */
export interface Exercise {
  /** The name of the exercise. */
  name: string;

  /** The unique id from the exercise table. */
  id: string | number | null;

  /** Indicates if an exercise was created by a user.
   * @remarks
   * Users cannot see exercises created by other users.
   */
  userAddedFlag?: string | null;
  recentCount?: number | null;
}

export interface StrengthWorkoutHeaderData {
  name: string | null;
  date: string | null;
}

export interface User {
  id: number | string;
  username: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
}

export interface UserRegisterDto extends Omit<User, "id"> {
  password: string;
}

export type UserRegisterFormData = UserRegisterDto;

export type MaybeWorkout = Workout_Hist | null;

export type confirmTypes = "confirm" | "delete";

export interface TemplateFolder {
  id: number | string;
  name: string;
  templates: (string | number )[];
  tmplWorkoutHists?: TmplWorkoutHist[];
}

export interface MenuAction {
  label: string;
  action: (arg?: any) => null | undefined | void | any;
}

export type AccessMode = "edit" | "from list" | "new" | "edit template";

export interface StrengthWorkoutEntryText {
  title: string;
}

export interface UploadFormData extends FormData {
  file: File;
}