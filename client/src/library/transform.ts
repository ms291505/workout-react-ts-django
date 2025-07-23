import type { Workout_Hist, Exercise_Hist, ExSet, TmplWorkoutHist, TmplExerciseHist, TmplExSet } from "./types";
import { isIntId } from "../utils";
import { createEmptyTemplate, createEmptyTmplExHist, createEmptyTmplExSet } from "./factories";


export function transformToTemplate(w: Workout_Hist): TmplWorkoutHist {

  const tmplExercises: TmplExerciseHist[] = [];

  w.exercises?.map((exHist) => {
    const tmplExSets: TmplExSet[] = [];

    exHist.exSets?.map((exSet) => {
      const tmplExSet: TmplExSet = {
        ...createEmptyTmplExSet(),
        order: exSet.order,
        weightLbs: exSet.weightLbs,
        reps: exSet.reps,
        type: exSet.type,
      }
      tmplExSets.push(tmplExSet);
    })

    const tmplExerciseHist: TmplExerciseHist = {
      ...createEmptyTmplExHist(),
      name: exHist.name,
      exerciseId: exHist.exerciseId,
      notes: exHist.notes,
      tmplExSets: tmplExSets,
    }

    tmplExercises.push(tmplExerciseHist);
  })

  const t: TmplWorkoutHist = {
    ...createEmptyTemplate(),
    name: w.name,
    notes: w.notes,
    tmplExercises: tmplExercises,
  }

  return t;
}

/**@deprecated */
export function transformFormData(raw: Record<string, string>): Workout_Hist {

  // workout header
  const workoutHist: Workout_Hist = {
    id: raw.id ? raw.id : "",
    name: raw.workoutName,
    date: raw.workoutDate,
    notes: raw.workoutNotes,
    exercises: [],
  };

  // checkout the exercise_hist indices
  const exIndices = Array.from(new Set(
    Object.keys(raw)
      .map((_key) => {
        const _match = _key.match(/^exerciseName\[(\d+)\]$/);
        return _match ? parseInt(_match[1], 10) : NaN;
      })
      .filter((_item) => !isNaN(_item))
  )).sort((a, b) => a - b);

  for (const exIndex of exIndices) {
    const exHistId = raw[`exercistHistId[${exIndex}]`];

    // exercise header
    const exHist: Exercise_Hist = {
      name: raw[`exerciseName[${exIndex}]`],
      exerciseId: raw[`exerciseId[${exIndex}]`],
      notes: raw[`exerciseNotes[${exIndex}]`],
      exSets: [],
      id: isIntId(exHistId) ? exHistId : null,
    };

    // checkout the exSet indices
    const setIndices = Array.from(new Set(
      Object.keys(raw)
        .map((_key) => {
          const _match = _key.match(
            new RegExp(`^weight\\[${exIndex}\\]\\[(\\d+)\\]$`)
          );
          return _match ? parseInt(_match[1], 10) : NaN;
        })
        .filter((_item) => !isNaN(_item))
    )).sort((a, b) => a - b);

    for (const setIndex of setIndices) {
      const exSetId = raw[`exSetId[${exIndex}][${setIndex}]`];
      const weightStr = raw[`weight[${exIndex}][${setIndex}]`];
      const repsStr = raw[`reps[${exIndex}][${setIndex}]`];

      // exSet rows
      const exSet: ExSet = {
        id: isIntId(exSetId) ? exSetId : null,
        order: setIndex,
        weightLbs: weightStr != null && weightStr !== ""
          ? parseFloat(weightStr)
          : null,
        reps: repsStr != null && repsStr !== ""
          ? parseInt(repsStr, 10)
          : null,
        type: raw[`setType[${exIndex}][${setIndex}]`] ?? null
      };

      exHist.exSets!.push(exSet);
    }

    workoutHist.exercises!.push(exHist);
  }

  return workoutHist;
}