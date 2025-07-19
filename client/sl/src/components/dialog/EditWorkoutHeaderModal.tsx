import { ChangeEvent, useState } from "react";
import { useWorkoutContext } from "../../context/WorkoutContext";
import MyDialog from "./MyDialog";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { StrengthWorkoutHeaderData, Workout_Hist } from "../../library/types";
import { CENTER_COL_FLEX_BOX } from "../../styles/StyleOverrides";
import { getLocalDateTimeString, toDateTimeLocal } from "../../utils";
import { Button } from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function EditWorkoutHeaderModal({
  open,
  onClose
}: Props) {
  const { workout, setWorkout } = useWorkoutContext();
  const [newData, setNewData] = useState<StrengthWorkoutHeaderData>({
    name: workout!.name,
    date: workout!.date
  })
  
  function handleDataChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setNewData(previous => ({ ...previous, [name]: value } as StrengthWorkoutHeaderData));
  }

  function handleSave(newData: StrengthWorkoutHeaderData) {
    setWorkout(prev => ({...prev, name: newData.name, date: newData.date} as Workout_Hist));
    onClose();
  }

  if (!workout){
    console.log("Tried to open the workout header dialog, but there isn't a workout in context.")
    return null;
  }

  return (
    <MyDialog
      open={open}
      onClose={onClose}
      title={"Edit Workout Name & Date"}
      content={
        <Box
          sx={{
            ...CENTER_COL_FLEX_BOX,
            gap: 2,
            mt: 1
          }}
        >
          <TextField
            type="text"
            name="name"
            label="Workout Name"
            defaultValue={workout.name}
            onChange={handleDataChange}
          />
          <TextField
            type="datetime-local"
            name="date"
            label="Workout Date"
            defaultValue={
              workout?.date
              ? toDateTimeLocal(workout.date)
              : getLocalDateTimeString()
            }
            onChange={handleDataChange}
          />
        </Box>
      }
      actions={
        <>
          <Button
            onClick={onClose}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => handleSave(newData)}
          >
            Save
          </Button>
        </>
      }

    />
  )
}