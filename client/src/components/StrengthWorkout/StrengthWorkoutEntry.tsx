import { useWorkoutContext } from "../../context/WorkoutContext";
import { EMPTY_EXERCISE_HIST } from "../../library/constants";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Exercise_Hist, Workout_Hist, TmplHist } from "../../library/types";
import { useNavigate, useParams } from "react-router";
import { fetchWorkoutDetail, postTemplate, postTemplateHist, postWorkout, updateWorkout } from "../../api";
import { useEffect, useState } from "react";
import ExerciseCard from "./ExerciseCard";
import ExSetEditor from "./ExSetEditor";
import ExPickerModal from "../dialog/ExPickerModal";
import { createEmptyExHist, createEmptyExSet, createEmptyWorkout, createEmtpyTmplHist } from "../../library/factories";
import { enqueueSnackbar } from "notistack";
import AddIcon from "@mui/icons-material/Add";
import { CENTER_COL_FLEX_BOX } from "../../styles/StyleOverrides";
import WorkoutHeader from "./WorkoutHeader";
import StrengthWorkoutNotes from "./SrengthWorkoutNotes";
import ConfirmDialog from "../dialog/ConfirmDialog";
import WorkoutSummary from "../WorkoutSummary/WorkoutSummary";
import TemplateMenu from "./TemplateMenu";
import { transformToTemplate } from "../../library/transform";

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
    workoutTemplate,
  } = useWorkoutContext();
  const [exPickerOpen, setExPickerOpen] = useState(false);
  const [finishConfirmOpen, setFinishConfirmOpen] = useState(false);
  const [templateFlag, setTemplateFlag] = useState(false);

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

    if (accessMode === "from list") {
      // do nothing.
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
        exSets: [createEmptyExSet(),]
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

    if (!accessMode) return;

    const tmplHist: TmplHist = { ...createEmtpyTmplHist() };

    if (templateFlag) {
      try {
        const t = await postTemplate(transformToTemplate(workout));
        enqueueSnackbar(`'${t.name}' added as template.`, { variant: "success" });
        tmplHist.tmplWorkoutHist = t.id!;
      } catch (err) {
        describeError(err);
      }
    }

    try {
      const w = accessMode.toLowerCase() === "new"
        ? await postWorkout(workout)
        : accessMode.toLowerCase() === "edit" &&
        await updateWorkout(workout)
      if (!w) throw new Error("An error occurred resolving the accessMode for the Workout Entry submission.");

      enqueueSnackbar(`'${w.name}' uploaded.`, { variant: "success" });
      tmplHist.workoutHist = w.id!;
      navigate("/");
    } catch (err) {
      describeError(err);
    }

    if (tmplHist.tmplWorkoutHist && tmplHist.workoutHist) {
      console.log(tmplHist);
      await postTemplateHist(tmplHist);
    } else console.log("didn't update the template hist")
  };


  const onCancel = () => {
    clearWorkout();
    navigate("/");
  }

  return (
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
      {workoutTemplate
        ? <span>{workoutTemplate.name}</span>
        : null
      }
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
            <AddIcon fontSize="large" />
            Add Exercise
          </Box>
        </Button>
      </Box>

      {/* Actions */}
      <TemplateMenu
        flagged={templateFlag}
        handleClick={() => setTemplateFlag(!templateFlag)}
        sx={{ mt: 2 }}
      />
      <Box
        sx={{
          mt: 2,
          display: "flex",
          direction: "row",
          gap: 2,
        }}
      >
        <Button
          onClick={onCancel}
          variant="outlined"
          sx={{
            flexGrow: 1
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => setFinishConfirmOpen(!finishConfirmOpen)}
          variant="contained"
          sx={{
            flexGrow: 1
          }}
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
          <>
            <WorkoutSummary
              w={workout}
              prettyHeader={false}
              style="short"
            />
          </>
        }
      />
    </Box>
  )
}
