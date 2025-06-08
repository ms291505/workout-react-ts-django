import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import { ExSet } from "../../library/types";
import { ChangeEvent, ReactNode, useEffect } from "react";
import { useWorkoutContext } from "../../context/WorkoutContext";

interface ExSetEditorProps {
  exSet: ExSet;
  order: number;
  children?: ReactNode;
}

export default function ExSetEditor({
  exSet,
  order,
  children
}: ExSetEditorProps
) {

  const { setWorkout } = useWorkoutContext();


  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    const updatedExSet: ExSet = {
      ...exSet,
      [name]: value
    };

    setWorkout((prev) => {
      if (!prev) return prev;
      if (!prev.exercises) {
        console.log("Tried to update an exSet from the exercise array was empy.");
        return prev;
      };
      return {
        ...prev,
        exercises: prev.exercises.map(exHist => ({
          ...exHist,
          exSets: exHist.exSets!.map(s =>
            s.id === updatedExSet.id ? updatedExSet : s
          )
        }))
      };
    });
  }

  useEffect(() => {
      handleChange({
        target: {
          name: "order",
          value: order,
        }
      } as unknown as ChangeEvent<HTMLInputElement>);
    }, [order]);

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      gap={2}
    >
      <Chip label={order} variant="outlined" />
      <TextField
        label="Weight (lbs)"
        name="weightLbs"
        value={exSet.weightLbs}
        onChange={handleChange}
      />
      <TextField
        label="Reps"
        name="reps"
        value={exSet.reps}
        onChange={handleChange}
      />
      { children }
    </Box>
  )
}