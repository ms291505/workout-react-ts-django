import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { fetchExercisesByName, postExercise } from "../api";
import type { Exercise } from "../library/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (exercise: Exercise) => void;
}

export default function ExercisePickerModal({
  open,
  onClose,
  onConfirm,
}: Props) {
  const [options, setOptions]     = useState<Exercise[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [value, setValue]         = useState<Exercise | null>(null);
  const [loading, setLoading]     = useState(false);
  const [confirming, setConfirming] = useState(false);

  // 1) Fetch search suggestions
  useEffect(() => {
    if (!open || inputValue.length < 2) {
      setOptions([]);
      return;
    }
    setLoading(true);
    fetchExercisesByName(inputValue)
      .then((data) => {
        // filter out nulls if needed
        setOptions(
          data.filter((ex): ex is Exercise & { id: number; name: string } =>
            ex.id != null && ex.name != null
          )
        );
      })
      .finally(() => setLoading(false));
  }, [inputValue, open]);

  // 2) Handle confirm (existing or create new)
  const handleConfirm = async () => {
    if (!value || !value.name) return;

    // existing exercise
    if (value.id != null) {
      onConfirm(value);
      onClose();
      return;
    }

    // new exercise
    setConfirming(true);
    try {
      const newEx = await postExercise(value.name);
      onConfirm(newEx);
      onClose();
    } catch (err) {
      console.error("Failed to create exercise:", err);
    } finally {
      setConfirming(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
    >
      <DialogTitle>Select or create an exercise</DialogTitle>
      <DialogContent sx={{ overflow: "visible" }}>
        <Autocomplete<Exercise, false, false, true>
          freeSolo
          options={options}
          getOptionLabel={(opt) => 
            typeof opt === "string"
              ? opt
              : opt.name ?? ""
          }
          loading={loading}
          value={value}
          inputValue={inputValue}
          onInputChange={(_, v) => {
            setInputValue(v);
            // clear selection if they type a new name
            if (!options.some((o) => o.name === v)) {
              setValue({ id: null, name: v, userAddedFlag: null });
            }
          }}
          onChange={(_, newVal) => {
            // newVal is either an Exercise or a string in freeSolo mode
            if (typeof newVal === "string") {
              setValue({ id: null, name: newVal, userAddedFlag: null });
            } else {
              setValue(newVal);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Exercise Title"
              variant="outlined"
              type="search"
              slotProps={{
                input: {
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading && <CircularProgress size={20} />}
                      {params.InputProps?.endAdornment}
                    </>
                  ),
                },
              }}
            />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={confirming}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={!value?.name?.trim() || confirming}
        >
          {confirming ? "Saving…" : "Confirm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
