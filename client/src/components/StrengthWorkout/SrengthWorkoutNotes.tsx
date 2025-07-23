import { useWorkoutContext } from "../../context/WorkoutContext";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { ReactNode } from "react";

interface StrengthWorkoutHeaderProps {
  children?: ReactNode,
};

export default function StrengthWorkoutNotes(
  { children }: StrengthWorkoutHeaderProps,
) {

  const { workout, handleOneChange } = useWorkoutContext();

  if (!workout) return null;

  return(
    <>
    <Box
      component="div"
      sx={{ mb:2 }}
    >
      <TextField
        type="text"
        name="notes"
        label="Workout Notes"
        multiline
        rows={3}
        fullWidth
        value={workout.notes}
        onChange={handleOneChange}
      />
      { children }
    </Box>
    </>   
  );
}