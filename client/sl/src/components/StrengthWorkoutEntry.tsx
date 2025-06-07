import { useWorkoutContext } from "../context/WorkoutContext";
import { EMPTY_EXERCISE_HIST, EMPTY_WORKOUT_HIST } from "../library/constants";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Workout_Hist } from "../library/types";
import { createDefaultWorkoutName, getLocalDateTimeString } from "../utils";
import StrengthWorkoutHeader from "./StrengthWorkout/SrengthWorkoutHeader";
import { useParams } from "react-router";
import { fetchWorkoutDetail } from "../api";
import { useEffect } from "react";
import ExerciseCard from "./StrengthWorkout/ExerciseCard";
import ExSetEditor from "./StrengthWorkout/ExSetEditor";

export default function StrengthWorkoutEntry() {
  const { workout, setWorkout } = useWorkoutContext();
  const { workoutId, accessMode } = useParams<{
    workoutId: string,
    accessMode: string,
  }>();
  
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

  return(
    <Box
      component="form"
    >
      <StrengthWorkoutHeader />
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
      <Box component="div">
        <Button onClick={() => console.log(workout)}>Print</Button>
      </Box>
    </Box>
  )
}