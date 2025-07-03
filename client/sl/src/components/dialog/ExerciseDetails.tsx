import { Exercise } from "../../library/types";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LoadingRoller from "../LoadingRoller";

interface Props {
  open: boolean,
  onClose: () => void,
  ex: Exercise | null
}

export default function ExerciseDetails({
  open,
  onClose,
  ex
}: Props) {

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={style}
    >
      {
        !ex
        ? <LoadingRoller size={50}/>
        : <Box>
            <Typography variant="h6">
              {ex.name}
            </Typography>
            <Typography>
              Some details about the exercise.
            </Typography>
          </Box>
      }
    </Modal>
  );
}