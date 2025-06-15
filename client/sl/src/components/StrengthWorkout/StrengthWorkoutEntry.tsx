import { useWorkoutContext } from "../../context/WorkoutContext";
import { EMPTY_EXERCISE_HIST, EMPTY_WORKOUT_HIST } from "../../library/constants";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Exercise_Hist, Workout_Hist } from "../../library/types";
import { createDefaultWorkoutName, getLocalDateTimeString } from "../../utils";
import StrengthWorkoutHeader from "./SrengthWorkoutHeader";
import { useNavigate, useParams } from "react-router";
import { fetchWorkoutDetail, updateWorkout } from "../../api";
import { useEffect, useState } from "react";
import ExerciseCard from "./ExerciseCard";
import ExSetEditor from "./ExSetEditor";
import ExPickerModal from "../ExPickerModal";
import { createEmptyExHist } from "../../library/factories";
import { enqueueSnackbar } from "notistack";

export default function StrengthWorkoutEntry() {
  const navigate = useNavigate();
  const { workout, setWorkout, exSelections, setExSelections } = useWorkoutContext();
  const { workoutId, accessMode } = useParams<{
    workoutId: string,
    accessMode: string,
  }>();
  const [exPickerOpen, setExPickerOpen] = useState(false);
  
  // Fallback in case of browser refresh:
  useEffect(() => {
    if (accessMode?.toLowerCase() === "edit" && !workout?.id) {
      fetchWorkoutDetail(Number(workoutId))
        .then((data) => {
          setWorkout(data);
        })
    }
  }, []);

  if (workout === null) {
    return "Loading workout...";
  }

  if (accessMode === "create") {
    const newWorkout: Workout_Hist = {
      ...EMPTY_WORKOUT_HIST,
      name: createDefaultWorkoutName(),
      date: getLocalDateTimeString(),
    };
    setWorkout(newWorkout);
  }

  if (workout.exercises === null) {
    const newWorkout: Workout_Hist = {
      ...workout,
      exercises: [
        {
          ...EMPTY_EXERCISE_HIST,
          id: crypto.randomUUID(),
        },
      ]
    };
    setWorkout(newWorkout);
  }

  function handleAddExercises() {
    if (exSelections.length < 1) return;
    if (!workout) return;
    const existingIds = new Set(workout.exercises?.map(e => e.exerciseId));
    const newExHists = exSelections
      .filter(ex => !existingIds.has(ex.id))
      .map((ex) => ({
        ...createEmptyExHist(),
      exerciseId: ex.id,
      name: ex.name,
    } as Exercise_Hist));

    const oldExHists: Exercise_Hist[] = workout.exercises ?? [];

    const newWorkout: Workout_Hist = {
      ...workout,
      exercises: [
          ...oldExHists,
          ...newExHists
      ]
    };

    setWorkout(newWorkout);
    setExSelections([]);
  }

  return(
    <Box
      component="form"
    >
      <StrengthWorkoutHeader />
      <Box
        display="flex"
        flexDirection="column"
        gap={2}
      >
        {
          workout.exercises?.length
          ? workout.exercises.map((exHist) => (
              <ExerciseCard exHist={exHist} key={exHist.id}>
              {
                exHist.exSets?.length
                ? exHist.exSets.map((exSet, idx) => (
                    <ExSetEditor key={exSet.id} exSet={exSet} order={idx + 1} />
                  ))
                : null
              }
              </ExerciseCard>
            ))
          : null
        }
      </Box>
      <Box component="div">
        <Button onClick={async () => {
          console.log(workout)
          if (accessMode?.toLowerCase() === "edit") {
            try {
              const w = await updateWorkout(workout);
              enqueueSnackbar(w.name + " updated.", { variant: "success" })
              navigate("/");
            }  catch (err) {
              if (err && typeof err === "object" && "name" in err) {
                const nameErrors = (err as any).name;
                const message = Array.isArray(nameErrors) ? nameErrors[0] : "An unkown Exercise Name error.";
                enqueueSnackbar(message, { variant: "error" });
              }
            }}}}
        >
          Save
        </Button>
        <Button
          onClick={() => setExPickerOpen(true)}
        >
          Add Exercise
        </Button>
        <ExPickerModal
          open={exPickerOpen}
          onClose={() => {
            setExPickerOpen(false);
            setExSelections([]);
          }}
          onConfirm={handleAddExercises}
        />
      </Box>
    </Box>
  )
}