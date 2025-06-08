import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField";
import { ChangeEvent, ReactNode } from "react";
import { useWorkoutContext } from "../../context/WorkoutContext";
import { Exercise_Hist } from "../../library/types";
import { CENTER_COL_FLEX_BOX } from "../../styles/StyleOverrides";

interface ExerciseCardProps {
  exHist: Exercise_Hist,
  children?: ReactNode,
}

export default function ExerciseCard(
  { exHist,
    children, }: ExerciseCardProps,
) {

  const { setWorkout } = useWorkoutContext();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    const updatedExHist: Exercise_Hist = {
      ...exHist,
      [name]: value
    };

    setWorkout((prev) => {
      if (!prev) return prev;
      if (!prev.exercises) {
        console.log("Tried to update exercises array but it was empty.");
        return prev;
      };

      const updatedExercises = prev.exercises.map((ex) =>
        ex.id === updatedExHist.id ? updatedExHist : ex
      );
      return {...prev, exercises: updatedExercises};
    });
  };
  

  return(
    <Paper
      elevation={3}
      sx={{ p: 2 }}
    >
      <Box
        sx={{ 
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mb: 2
         }}
      >
        <TextField
          label="Exercise Name"
          name="name"
          value={exHist.name ?? ""}
          onChange={handleChange}
        />
        <TextField
          label="Exercise Notes"
          name="notes"
          value={exHist.notes ?? ""}
          onChange={handleChange}
        />
        <Box component="span"
          sx={{
            ...CENTER_COL_FLEX_BOX,
          }}
        >
          - Sets -
        </Box>
      </Box>
      { children }
    </Paper>
  )
}