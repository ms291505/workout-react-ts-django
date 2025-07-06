import { Exercise } from "../../library/types";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LoadingRoller from "../LoadingRoller";
import { MODAL_STYLE } from "../../styles/StyleOverrides";

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


  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      {
        !ex
        ? <LoadingRoller size={50}/>
        : <Box
            sx={{...MODAL_STYLE}}
          >
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