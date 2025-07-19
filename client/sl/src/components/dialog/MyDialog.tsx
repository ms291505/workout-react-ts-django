import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { ReactNode } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string | ReactNode;
  content?: string | ReactNode;
  actions?: ReactNode
}

export default function MyDialog({
  open,
  onClose,
  title,
  content,
  actions
}: Props) {

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
    >
      {title &&
        <DialogTitle>
          {title}
        </DialogTitle>
      }
      {content &&
        <DialogContent>
          {content}
        </DialogContent>
      }
      {actions &&
        <DialogActions>
          {actions}
        </DialogActions>
      }
    </Dialog>
  )
}