import { Exercise_Hist, ExSet } from "./types";
import { Workout_Hist } from "./types";

export const EMPTY_EX_SET: ExSet = {
  order: null,
  weightLbs: null,
  reps: null,
  type: "",
};

export const testSet: ExSet = {
  order: 1,
  weightLbs: 50,
  reps: 5,
  type: "Working",
};


export const EX_SET_TYPE_LIST: Array<string> = [
  "Warm-up",
  "Working",
  "MyoRep",
  "Drop"
]

export const EMPTY_EXERCISE_HIST: Exercise_Hist = {
  name: null,
  notes: null,
  exSets: []
}

/** @type {Workout_Hist} */
export const testWorkout: Workout_Hist = {
  name: "Full Body Strength",
  date: "2024-01-26",
  notes: "Focus on compound lifts and maintain strict form.",
  exercises: [
    {
      name: "Back Squat",
      id: 1,
      notes: "Keep knees tracking over toes; hit parallel depth.",
      exerciseId: 1,
      exSets: [
        { order: 1, weightLbs: 95,  reps: 8, type: "WU", id: 1 },
        { order: 2, weightLbs: 135, reps: 5, type: "WK", id: 2 },
        { order: 3, weightLbs: 185, reps: 5, type: "WK", id: 3 },
      ]
    },
    {
      name: "Bench Press",
      id: 2,
      notes: "Tuck elbows, drive feet into floor.",
      exerciseId: 2,
      exSets: [
        { order: 1, weightLbs: 65,  reps: 10, type: "WU", id: 4 },
        { order: 2, weightLbs: 95,  reps: 5,  type: "WK", id: 5 },
        { order: 3, weightLbs: 115, reps: 3,  type: "MX", id: 6 }
      ]
    },
    {
      name: "Deadlift",
      id: 3,
      notes: null,
      exerciseId: 3,
      exSets: [
        { order: 1, weightLbs: 135, reps: 5, type: "WU", id: 7 },
        { order: 2, weightLbs: 225, reps: 3, type: "WK", id: 8 },
        { order: 3, weightLbs: 265, reps: 1, type: "WK", id: 9 }
      ]
    },
  ]
};

export const ISO_PATTERN = /^\d{4}-\d{2}-\d{2}$/;