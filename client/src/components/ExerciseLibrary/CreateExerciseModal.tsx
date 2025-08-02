import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useEffect, useRef, useState } from "react";
import { postExercise } from "../../api";
import { useSnackbar } from "notistack";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: () => void;
  newName?: string | null;
}

export default function CreateExerciseModal ({
  newName,
  open,
  onClose,
  onCreate,
}: Props) {

  const [creating, setCreating] = useState(false);
  const [newExName, setNewExName] = useState("");
  const [error, setError] = useState("");
  const {enqueueSnackbar} = useSnackbar();

  const inputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    if (open) {
      setNewExName(newName || "");
      setError("");
    }
  }, [open, newName]);
  

  const handleCreate = async () => {
    setCreating(true);
    try {
      const newExercise = await postExercise(newExName);
      enqueueSnackbar(newExercise.name + " was added to the library.", {variant: "success"});
      onCreate();
      onClose();
    } catch (err) {
      setError("An error occured while creating the exercise.");
      console.error(error, err);
      if (err && typeof err === "object" && "name" in err) {
        const nameErrors = (err as any).name;
        const message = Array.isArray(nameErrors) ? nameErrors[0] : "An unkown Exercise Name error.";
        setError(message);
        enqueueSnackbar(message, { variant: "error" });
      }
    } finally {
      setCreating(false);
    }
  }

  return(
    <Dialog
      open={open}
      onClose={onClose}
    >
        <DialogTitle>
          Create an exercise
        </DialogTitle>
        <DialogContent>
          <TextField
            inputRef={inputRef}
            label="New Exercise Name"
            value={newExName}
            sx={{
              mt: 1
            }}
            onChange={(e) => setNewExName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            disabled={newExName.trim() === "" || creating}
          >
            {creating ? "Creating..." : "Create"}
          </Button>
        </DialogActions>
    </Dialog>
  )
}