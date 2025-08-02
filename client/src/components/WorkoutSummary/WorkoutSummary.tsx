import { Workout_Hist } from "../../library/types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { parseToWeekdayDate } from "../../utils";
import LongSummaryTable from "./LongSummaryTable";
import ShortSummaryTable from "./ShortSummaryTable";

type Style = "short" | "long";

interface Props {
  w: Workout_Hist | null;
  prettyHeader?: boolean;
  style?: Style;
}


export default function WorkoutSummary({
  w,
  prettyHeader = true,
  style = "long",
}: Props) {

  if (w === null) return(null);
  return(
    <Box
      sx={{
        maxWidth: 350,
      }}
    >
      { prettyHeader &&
        <>
        <Typography variant="h6">
          {w.name}
        </Typography>
        <Typography variant="body1">
          {w.date && parseToWeekdayDate(w.date)}
        </Typography>
        <Divider
          sx={{
            mb: 2,
            borderColor: "primary.main",
            borderBottomWidth: 2
          }}
        />
        </>
      }
      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        sx={{
          maxHeight: 300,
          overflowY: "auto"
        }}
      >
      { w.exercises && w.exercises.map(e => (
        <Box key={e.id}>
          <Typography variant="body1" fontWeight="bold">
            {e.name}
          </Typography>
          { style === "short"
            ? <ShortSummaryTable exSets={e.exSets} />
            : <LongSummaryTable exSets={e.exSets} />
          }
        </Box>
        ))
      }
      </Box>
    </Box>
  )
}