// types.js

export interface ExSet {
  id: string | number | null;
  setOrder: number | null;
  weight: number | null;
  reps: number | null;
  setType: string | null;
}

export interface Exercise {
  name: string | null;
  id: string | number | null;
  notes: string | null;
  exSets: ExSet[] | null;
}

export interface Workout {
  name: string | null;
  date: string | null;
  notes: string | null;
  exercises: Exercise[] | null;
}