import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { ReactNode } from "react";
import { confirmTypes } from "../../library/types";

interface Props {
  onConfirm: () =>(void);
  title?: string;
  content?: string | ReactNode;
  open: boolean;
  onClose: () => void;
  confirmText?: string;
  closeText?: string;
  message?: string;
  confirmType?: confirmTypes;
}

export default function ConfirmDialog ({
  onConfirm,
  content,
  title,
  open,
  message,
  onClose,
  confirmText = "Confirm",
  closeText = "Cancel",
  confirmType = "confirm"
}: Props) {

  return(
    <Dialog
      open={open}
      onClose={onClose}
    >
      {
        title
        ? <DialogTitle>
            {title}
          </DialogTitle>
        : null
      }
      {
        (content ?? message)
        ? <DialogContent>
            <Typography
              variant="body1"
            >
              {message}
            </Typography>
            {content}
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
          color={
            confirmType === "delete"
            ? "error"
            : "primary"
          }
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}