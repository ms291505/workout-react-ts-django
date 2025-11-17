import Typography from "@mui/material/Typography";
import { parseToWeekdayDate } from "../../utils";

interface Props {
  display: boolean,
  date: string
}

export default function WorkoutHeaderDate({
  display,
  date
}: Props) {
  if (!display) return null;
  if (!date) {
    console.error("Tried to display a date in the workout header but it's null.");
    return null;
  }

  return(
    <Typography variant="body1">
      {parseToWeekdayDate(date)}
    </Typography>
  )
}