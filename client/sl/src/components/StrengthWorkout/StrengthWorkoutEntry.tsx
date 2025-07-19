import { useWorkoutContext } from "../../context/WorkoutContext";
import { EMPTY_EXERCISE_HIST } from "../../library/constants";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Exercise_Hist, Workout_Hist } from "../../library/types";
import { useNavigate, useParams } from "react-router";
import { fetchWorkoutDetail, postWorkout, updateWorkout } from "../../api";
import { useEffect, useState } from "react";
import ExerciseCard from "./ExerciseCard";
import ExSetEditor from "./ExSetEditor";
import ExPickerModal from "../dialog/ExPickerModal";
import { createEmptyExHist, createEmptyWorkout } from "../../library/factories";
import { enqueueSnackbar } from "notistack";
import AddIcon from "@mui/icons-material/Add";
import { CENTER_COL_FLEX_BOX } from "../../styles/StyleOverrides";
import WorkoutHeader from "./WorkoutHeader";
import StrengthWorkoutNotes from "./SrengthWorkoutNotes";
import ConfirmDialog from "../dialog/ConfirmDialog";
import WorkoutSummary from "./WorkoutSummary";

interface Props {
  accessMode: string;
};

export default function StrengthWorkoutEntry({
  accessMode
}: Props) {
  const navigate = useNavigate();
  const {
    workout,
    setWorkout,
    exSelections,
    setExSelections,
    clearWorkout,
   } = useWorkoutContext();
  const [exPickerOpen, setExPickerOpen] = useState(false);
  const [finishConfirmOpen, setFinishConfirmOpen] = useState(false);
  
  const { workoutId } = useParams<{
    workoutId?: string,
  }>();
  
  // Edit mode fallback in case of browser refresh:
  useEffect(() => {
    if (accessMode?.toLowerCase() === "edit" && !workout?.id) {
      fetchWorkoutDetail(Number(workoutId))
        .then((data) => {
          setWorkout(data);
        })
    }
    if (accessMode === "new") {
      setWorkout(createEmptyWorkout());
    }
  }, []);

  if (workout === null) {
    return "Loading workout...";
  }

  if (workout.exercises === null) {
    const newWorkout: Workout_Hist = {
      ...workout,
      exercises: [
        {
          ...EMPTY_EXERCISE_HIST,
          id: crypto.randomUUID(),
        },
      ]
    };
    setWorkout(newWorkout);
  }

  function handleAddExercises() {
    if (exSelections.length < 1) return;
    if (!workout) return;
    const existingIds = new Set(workout.exercises?.map(e => e.exerciseId));
    const newExHists = exSelections
      .filter(ex => !existingIds.has(ex.id))
      .map((ex) => ({
        ...createEmptyExHist(),
      exerciseId: ex.id,
      name: ex.name,
    } as Exercise_Hist));

    const oldExHists: Exercise_Hist[] = workout.exercises ?? [];

    const newWorkout: Workout_Hist = {
      ...workout,
      exercises: [
          ...oldExHists,
          ...newExHists
      ]
    };

    setWorkout(newWorkout);
    setExSelections([]);
  };

  const handleFinish = async () => {
          function describeError(err: any) {
            if (err && typeof err === "object" && "name" in err) {
              const nameErrors = (err as any).name;
              const message = Array.isArray(nameErrors) ? nameErrors[0] : "An unkown Exercise Name error.";
              enqueueSnackbar(message, { variant: "error" });
            }
          };

          if (accessMode?.toLowerCase() === "edit") {
            try {
              const w = await updateWorkout(workout);
              enqueueSnackbar(`'${w.name}' updated.`, { variant: "success" });
              navigate("/");
            }  catch (err) {
              describeError(err);
            }
          };
          
          if (accessMode?.toLowerCase() === "new") {
            try {
              const w = await postWorkout(workout);
              enqueueSnackbar(`'${w.name}' created.`, { variant: "success" });
              navigate("/");
            } catch (err) {
              describeError(err);
            }
          };
    };

    const onCancel = () => {
      clearWorkout();
      navigate("/");
    }

  return(
    <Box
      component="form"
      sx={{
        width: "100%",
        maxWidth: 500,
        mx: "auto"
      }}
    >
      <WorkoutHeader
        name={workout.name}
        date={workout.date}
      />
      <StrengthWorkoutNotes />
      <Box
        display="flex"
        flexDirection="column"
        gap={2}
      >
        {
          workout.exercises?.length
          ? workout.exercises.map((exHist) => (
              <ExerciseCard exHist={exHist} key={exHist.id}>
              {
                exHist.exSets?.length
                ? exHist.exSets.map((exSet, idx) => (
                    <ExSetEditor key={exSet.id} exSet={exSet} order={idx + 1} />
                  ))
                : null
              }
              </ExerciseCard>
            ))
          : null
        }
      <Button
        variant="outlined"
        sx={{
          width: "100%",
          height: 100,
        }}
        onClick={() => setExPickerOpen(true)}
      >
        <Box
          sx={{
            ...CENTER_COL_FLEX_BOX,
            alignItems: "center",
            gap: 1
          }}
        >
          <AddIcon fontSize="large"/>
          Add Exercise
        </Box>
      </Button>
      </Box>

      {/* Actions */}
      <Box
        component="div"
        sx={{
          mt: 2
        }}
      >
        <Button
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          onClick={() => setFinishConfirmOpen(!finishConfirmOpen)}
          variant="contained"
        >
          Finish
        </Button>
      </Box>


    <ExPickerModal
      open={exPickerOpen}
      onClose={() => {
        setExPickerOpen(false);
        setExSelections([]);
      }}
      onConfirm={handleAddExercises}
    />
    <ConfirmDialog
      open={finishConfirmOpen}
      onClose={() => setFinishConfirmOpen(false)}
      onConfirm={handleFinish}
      title="Ready to finish?"
      content={
        <WorkoutSummary
          w={workout}
          prettyHeader={false}
        />
      }
    />
    </Box>
  )
}