import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import ExerciseLibrary from "./ExerciseLibrary";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ExPickerModal({
  open,
  onClose,
  onConfirm,
}: Props) {

  function handleConfirm() {
    onConfirm();
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
    >
      <DialogTitle>Select or create an exercise</DialogTitle>
      <DialogContent>
        <ExerciseLibrary />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}