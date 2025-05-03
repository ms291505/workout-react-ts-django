/** @typedef {import("./types.js").ExSet} */
/** @typedef {import("./types.js").Exercise} */
/** @typedef {import("./types.js").Workout} */

/** @type {ExSet}*/
export const EMPTY_EX_SET = {
  setOrder: null,
  weight: null,
  reps: null,
  setType: "",
};

/** @type {ExSet} */
export const testSet = {
  setOrder: 1,
  weight: 50,
  reps: 5,
  setType: "Working",
};

/** @type {Array} */
export const EX_SET_TYPE_LIST = [
  "Warm-up",
  "Working",
  "MyoRep",
  "Drop"
]

/** @type {Exercise} */
export const EMPTY_EXERCISE = {
  name: null,
  notes: null,
  exSets: []
}

/** @type {Workout} */
export const testWorkout = {
  name: "Full Body Strength",
  date: "2024-01-26",
  notes: "Focus on compound lifts and maintain strict form.",
  exercises: [
    {
      name: "Back Squat",
      id: 1,
      notes: "Keep knees tracking over toes; hit parallel depth.",
      exSets: [
        { setOrder: 1, weight: 95,  reps: 8, setType: "Warm-up", id: 1 },
        { setOrder: 2, weight: 135, reps: 5, setType: "Working", id: 2 },
        { setOrder: 3, weight: 185, reps: 5, setType: "Working", id: 3 },
      ]
    },
    {
      name: "Bench Press",
      id: 2,
      notes: "Tuck elbows, drive feet into floor.",
      exSets: [
        { setOrder: 1, weight: 65,  reps: 10, setType: "Warm-up", id: 4 },
        { setOrder: 2, weight: 95,  reps: 5,  setType: "Working", id: 5 },
        { setOrder: 3, weight: 115, reps: 3,  setType: "Working", id: 6 }
      ]
    },
    {
      name: "Deadlift",
      id: 3,
      notes: null,
      exSets: [
        { setOrder: 1, weight: 135, reps: 5, setType: "Warm-up", id: 7 },
        { setOrder: 2, weight: 225, reps: 3, setType: "Working", id: 8 },
        { setOrder: 3, weight: 265, reps: 1, setType: "Working", id: 9 }
      ]
    },
  ]
};

export const ISO_PATTERN = /^\d{4}-\d{2}-\d{2}$/;