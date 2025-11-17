import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import EditSquareIcon from '@mui/icons-material/EditSquare';
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import EditWorkoutHeaderModal from "../dialog/EditWorkoutHeaderModal";
import WorkoutHeaderDate from "./WorkoutHeaderDate";

type Mode = "workout" | "template";

interface Props {
  name: string | null;
  date: string | null;
  mode?: Mode;
}

export default function WorkoutHeader({
  name,
  date,
  mode = "workout"
}: Props) {

  const [headerEditOpen, setHeaderEditOpen] = useState(false);

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
          <WorkoutHeaderDate
            display={mode === "workout"}
            date={date ? date : ""}
          />
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
