
import Box from "@mui/material/Box";
import { Exercise } from "../../library/types";
import ExerciseAttribute from "./ExerciseAttribute";
import Divider from "@mui/material/Divider";
import { useWorkoutContext } from "../../context/WorkoutContext";
import Checkbox from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

interface Props {
  ex: Exercise
}


export default function ({ex}: Props) {
  const {exSelections} = useWorkoutContext();

  const countValue = () => {
    console.log(ex)
    if (!ex.recentCount) return "0 Workouts";
    if (ex.recentCount === 1) return "1 Workout";
    return `${ex.recentCount} Workouts`;
  };

  return(
    <>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        gap={1}
        justifyContent="space-between"
        width="100%"
      >
        <Box
        >
        {
          exSelections.some((e) => e.id === ex.id)
          ? <Checkbox />
          : <CheckBoxOutlineBlankIcon />
        }
        </Box>
        <Divider orientation="vertical" flexItem/>
        <ExerciseAttribute
          label="Custom:"
          value={ex.userAddedFlag ? ex.userAddedFlag : ""}
        />
        <Divider orientation="vertical" flexItem/>
        <ExerciseAttribute
          value={countValue()}
          label="30 Days:"
        />
        <Divider orientation="vertical" flexItem/>
        <ExerciseAttribute
          value="Back"
          label="Split:"
        />
      </Box>
    </>
  )
}