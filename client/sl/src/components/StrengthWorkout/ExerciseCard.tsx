import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField";
import { ChangeEvent, ReactNode } from "react";
import { useWorkoutContext } from "../../context/WorkoutContext";
import { Exercise_Hist, ExSet } from "../../library/types";
import { CENTER_COL_FLEX_BOX } from "../../styles/StyleOverrides";
import Button from "@mui/material/Button";
import { createEmptyExSet } from "../../library/factories";
import Divider from "@mui/material/Divider";

interface ExerciseCardProps {
  exHist: Exercise_Hist,
  children?: ReactNode,
}

export default function ExerciseCard(
  { exHist,
    children, }: ExerciseCardProps,
) {

  const { workout, setWorkout } = useWorkoutContext();

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

  function handleAddSet() {
    const newExSet: ExSet = {
      ...createEmptyExSet(),
    }

    setWorkout((prev) => {
      if (!prev || !prev.exercises) return prev;

      const updatedExercises = prev.exercises.map((ex) => {
        if (ex.id !== exHist.id) return ex;

        const updatedExSets = ex.exSets ? [...ex.exSets, newExSet] : [newExSet];
        return {
          ...ex,
          exSets: updatedExSets,
        };
      });

      return {
        ...prev,
        exercises: updatedExercises,
      };
    });
  };

  function handleDeleteExHist() {
    setWorkout((prev) => {
      if (!prev || !prev.exercises) return prev;

      const filteredExercises = prev.exercises.filter((eH) => eH.id !== exHist.id);

      return {
        ...prev,
        exercises: filteredExercises,
      };
    });
  };
  

  return(
    <Paper
      elevation={3}
      sx={{ p: 1.5 }}
    >
      <Box
        sx={{ 
          display: "flex",
          flexDirection: "column",
          gap: 1,
          mb: 2
         }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1
          }}
        >
          <TextField
            label="Exercise Name"
            name="name"
            value={exHist.name ?? ""}
            sx={{
              flexGrow: 1
            }}
            onChange={handleChange}
          />
          <Button
            aria-label="Delete exercise"
            variant="outlined"
            color="error"
            onClick={handleDeleteExHist}
            disabled={(workout?.exercises || []).length > 1 ? false : true}
          >
            Delete
          </Button>
        </Box>
        <TextField
          label="Exercise Notes"
          name="notes"
          value={exHist.notes ?? ""}
          onChange={handleChange}
        />
        <Divider
          sx={{mt: 1}}
        >
          SETS
        </Divider>
      </Box>
      <Box
        sx={{
          mb: 2,
          ...CENTER_COL_FLEX_BOX,
          gap: 2
        }}
      >
        { children }
      </Box>
      <Box
        sx={{
          ...CENTER_COL_FLEX_BOX,
        }}
      >
        <Button
          variant="contained"
          onClick={ handleAddSet }
          sx={{
            m: 1
          }}
        >
          Add Set
        </Button>
      </Box>
    </Paper>
  )
}