import { createDefaultWorkoutName, getLocalDateTimeString } from "../utils";
import { AccessMode, Exercise, Exercise_Hist, ExSet, StrengthWorkoutEntryText, TemplateFolder, TmplExerciseHist, TmplExSet, TmplHist, TmplWorkoutHist, Workout_Hist } from "./types";


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
    weightLbs: 0,
    reps: 0,
    type: "WK"
  }
}

export function createEmptyTemplate(): TmplWorkoutHist {
  return {
    name: "",
    id: crypto.randomUUID(),
    notes: "",
    tmplExercises: []
  }
}

export function createEmptyTemplateFolder(): TemplateFolder {
  return {
    name:"",
    templates: [],
    id: crypto.randomUUID(),
}}

export function createEmptyTmplExHist(ex?: Exercise): TmplExerciseHist {
  return {
    id: crypto.randomUUID(),
    exerciseId: ex ? ex.id : null,
    name: ex ? ex.name : "",
    notes: "",
    tmplExSets: []
  }
}

export function createEmptyTmplExSet(): TmplExSet {
  return {
    id: crypto.randomUUID(),
    order: null,
    weightLbs: 0,
    reps: 0,
    type: "WK"
  }
}

export function createEmtpyTmplHist(): TmplHist {
  return {
    id: crypto.randomUUID(),
    workoutHist: 0,
    tmplWorkoutHist: 0
  }
}

export function createStrengthWorkoutEntryText(
  accessMode: AccessMode,
): StrengthWorkoutEntryText {

  let title = "";

  switch (accessMode) {
    case "edit":
      title = "Editing Workout";
      break;
    case "edit template":
      title = "Editing Template";
      break;
    case "from list":
      title = "From List" // Not sure this is ever actually used anywhere?
      break;
    case "new":
      title = "Entering New Workout";
      break;
    default:
      title = "No Title, this shouldn't happen."
  }

  return ({
    title: title,
  })
}