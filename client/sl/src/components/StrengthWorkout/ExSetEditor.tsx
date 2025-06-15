import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { ExSet } from "../../library/types";
import { ChangeEvent, ReactNode, useEffect, FocusEvent } from "react";
import { useWorkoutContext } from "../../context/WorkoutContext";
import { useSetTypeChoices } from "../../hooks/useSetTypeChoices";
import LoadingRoller from "../LoadingRoller";
import { DEFAULT_EX_SET_TYPE } from "../../library/constants";
import { isDecimalString, isNonNegativeIntegerString } from "../../utils/inputValidators";

interface ExSetEditorProps {
  exSet: ExSet;
  order: number;
  children?: ReactNode;
}

export default function ExSetEditor({
  exSet,
  order,
  children
}: ExSetEditorProps
) {

  const { setWorkout } = useWorkoutContext();
  const { choices: exSetTypeChoices, loading } = useSetTypeChoices();


  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    if (name === "weightLbs") {
      if (value !== "" && !isDecimalString(value)) {
        return;
      }
    }

    if (name === "reps") {
      if (value !== "" && !isNonNegativeIntegerString(value)) {
        return;
      }
    }

    const updatedExSet: ExSet = {
      ...exSet,
      [name]: value
    };

    setWorkout((prev) => {
      if (!prev) return prev;
      if (!prev.exercises) {
        console.log("Tried to update an exSet from the exercise array was empy.");
        return prev;
      };
      return {
        ...prev,
        exercises: prev.exercises.map(exHist => ({
          ...exHist,
          exSets: exHist.exSets!.map(s =>
            s.id === updatedExSet.id ? updatedExSet : s
          )
        }))
      };
    });
  }

  function handleWeightBlur(e: FocusEvent<HTMLInputElement>) {
    const v = e.target.value;

    if (v === ".") {
      handleChange({
        target: {
          name: "weightLbs",
          value: null
        }
      } as unknown as ChangeEvent<HTMLInputElement>);
    }

    if (v.endsWith(".")) {
      handleChange({
        target: {
          name: "weightLbs",
          value: parseFloat(v.replace(/\.$/, "")),
        }
      } as unknown as ChangeEvent<HTMLInputElement>);
    }

    handleChange({
      target: {
        name: "weightLbs",
        value: parseFloat(v),
      }
    } as unknown as ChangeEvent<HTMLInputElement>);
  }

  useEffect(() => {
      handleChange({
        target: {
          name: "order",
          value: order,
        }
      } as unknown as ChangeEvent<HTMLInputElement>);
  }, [order]);

  const defaultType = () => {
    if (exSet.type && exSet.type !== "") {
      return exSet.type;
    } else {
      return DEFAULT_EX_SET_TYPE;
    }
  }
  const handleDeleteSet = () => {
    setWorkout((prev) => {
      if (!prev || !prev.exercises) return prev;

      const updatedExercises = prev.exercises.map((ex) => {
        
        if (!ex.exSets?.some((s) => s.id === exSet.id)) return ex;

        const filteredSets = ex.exSets.filter((s) => s.id !== exSet.id);

        return {
          ...ex,
          exSets: filteredSets,
        };
      });

      return {
        ...prev,
        exercises: updatedExercises,
      };
    });
  };


  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      gap={2}
    >
      <Chip label={order} variant="outlined" />
      <TextField
        label="Weight (lbs)"
        name="weightLbs"
        value={exSet.weightLbs ?? ""}
        onChange={handleChange}
        onBlur={handleWeightBlur}
        size="small"
        sx={{
          width: 125
        }}
      />
      <TextField
        label="Reps"
        name="reps"
        value={exSet.reps ?? ""}
        onChange={handleChange}
        size="small"
        sx={{
          width: 125
        }}
      />
      {
        loading
        ? <LoadingRoller size={50} />
        : (
          <TextField
            select
            name="setType"
            defaultValue={ defaultType }
            size="small"
            label="Set Type"
            sx={{
              width: 125
            }}
          >
            {exSetTypeChoices.map(({value, label}) => (
              <MenuItem value= { value } key={ value }>
                { label }
              </MenuItem>
            ))}
          </TextField>
        )
      }
      <IconButton
        onClick={ handleDeleteSet }
      >
        <DeleteIcon />
      </IconButton>
      { children }
    </Box>
  )
}