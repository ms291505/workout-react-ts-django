import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

interface Props {
  onConfirm: () =>(void);
  shortMessage?: string;
  verboseMessage?: string;
  open: boolean;
  onClose: () => void;
  confirmText?: string;
  closeText?: string
}

export default function ConfirmDialog ({
  onConfirm,
  verboseMessage = "",
  shortMessage = "",
  open,
  onClose,
  confirmText = "Confirm",
  closeText = "Cancel"
}: Props) {

  return(
    <Dialog
      open={open}
      onClose={onClose}
    >
      {
        shortMessage
        ? <DialogTitle>
            {shortMessage}
          </DialogTitle>
        : null
      }
      {
        verboseMessage
        ? <DialogContent>
            <Typography
              variant="body1"
            >
              {verboseMessage}
            </Typography>
          </DialogContent>
        : null
      }
      <DialogActions>
        <Button
          variant="outlined"
          onClick={onClose}
        >
          {closeText}
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}