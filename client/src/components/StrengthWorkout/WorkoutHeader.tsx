import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import EditSquareIcon from '@mui/icons-material/EditSquare';
import { parseToWeekdayDate } from "../../utils";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import EditWorkoutHeaderModal from "../dialog/EditWorkoutHeaderModal";

interface Props {
  name: string | null;
  date: string | null;
  tmplName?: string | null;

}

export default function WorkoutHeader({
  name,
  date,
  tmplName = ""
}: Props) {

  const [headerEditOpen, setHeaderEditOpen] = useState(false);

  const tmplDisplay = "Template: " + tmplName;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Typography variant="h6">
            {name}
          </Typography>
          <Typography variant="body1">
            {date && parseToWeekdayDate(date)}
          </Typography>
        </Box>
        <IconButton
          onClick={() => setHeaderEditOpen(!headerEditOpen)}
        >
          <EditSquareIcon />
        </IconButton>
      </Box>
      <Divider
        sx={{
          mb: 2,
          borderColor: "primary.main",
          borderBottomWidth: 2
        }}
      />

      {/* Modals */}
      <EditWorkoutHeaderModal
        open={headerEditOpen}
        onClose={() => setHeaderEditOpen(false)}
      />
    </>
  )
}
