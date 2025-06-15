import { createDefaultWorkoutName, getLocalDateTimeString } from "../utils";
import { Exercise, Exercise_Hist, ExSet, Workout_Hist } from "./types";


export function createEmptyWorkout(): Workout_Hist {
  return {
    name: createDefaultWorkoutName(),
    id: crypto.randomUUID(),
    date: getLocalDateTimeString(),
    notes: "",
    exercises: []
  }
}

export function createEmptyExHist(ex?: Exercise): Exercise_Hist {
  return {
    id: crypto.randomUUID(),
    exerciseId: ex ? ex.id : null,
    name: ex ? ex.name : "",
    notes: "",
    exSets: []
  }
}

export function createEmptyExSet(): ExSet {
  return {
    id: crypto.randomUUID(),
    order: null,
    weightLbs: null,
    reps: null,
    type: "WK"
  }
}