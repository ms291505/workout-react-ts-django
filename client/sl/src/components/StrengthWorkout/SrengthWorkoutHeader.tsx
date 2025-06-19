import { useWorkoutContext } from "../../context/WorkoutContext";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { ChangeEvent, ReactNode } from "react";
import { Workout_Hist } from "../../library/types";
import { getLocalDateTimeString, toDateTimeLocal } from "../../utils";

interface StrengthWorkoutHeaderProps {
  children?: ReactNode,
};

export default function StrengthWorkoutHeader(
  { children }: StrengthWorkoutHeaderProps,
) {

  const { workout, setWorkout } = useWorkoutContext();
  
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setWorkout(previous => ({ ...previous, [name]: value } as Workout_Hist));
  }

  if (!workout) return null;

  return(
    <>
    <Box
      component="div"
      sx={{ mb:2 }}
    >
      <Box
        component="div"
        sx={{ mb: 2 }}
      >
        <TextField
          type="text"
          name="name"
          label="Workout Name"
          value={workout.name}
          onChange={handleChange}
        />
        {" "}
        <TextField
          type="datetime-local"
          name="date"
          label="Workout Date"
          value={
            workout?.date
            ? toDateTimeLocal(workout.date)
            : getLocalDateTimeString()}
          onChange={handleChange}
        />
      </Box>
      <TextField
        type="text"
        name="notes"
        label="Workout Notes"
        multiline
        rows={3}
        fullWidth
        value={workout.notes}
        onChange={handleChange}
      />
      { children }
    </Box>
    </>   
  );
}