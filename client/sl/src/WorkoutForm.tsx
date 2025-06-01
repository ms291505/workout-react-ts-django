import styles from "./WorkoutForm.module.css";
import { useEffect, useState, MouseEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createDefaultWorkoutName, getLocalDateTimeString, handleSubmitToLog, toDateTimeLocal } from "./utils";
import ExerciseCard from "./ExerciseCard";
import { EMPTY_EXERCISE_HIST, testWorkout } from "./library/constants";
import { v4 as uuidv4 } from "uuid";
import AddExerciseButton from "./AddExerciseButton";
import { Exercise, Exercise_Hist, Workout_Hist } from "./library/types";
import { fetchWorkoutDetail, postWorkout, updateWorkout } from "./api";
import ExercisePickerModal from "./components/ExercisePickerModal";
import TextField from "@mui/material/TextField";
import { transformFormData } from "./library/transform";

interface WorkoutFormProps {
  editMode?: boolean;
}
/**
 * The form that handles entering, editting, and submitting workout data.
 */
export default function WorkoutForm({ editMode = false }: WorkoutFormProps) {
  const navigate = useNavigate();
  const { workoutId } = useParams<{ workoutId: string }>();

  const [workout, setWorkout] = useState<Workout_Hist | null>(null);
  const [exerciseList, setExerciseList] = useState<Exercise_Hist[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    if (editMode && workoutId) {
      fetchWorkoutDetail(Number(workoutId))
        .then((data) => {
          setWorkout(data);
          console.log(data);
          if (data.exercises && Array.isArray(data.exercises)) {
            setExerciseList(
              data.exercises.map((ex) => ({ ...ex, id: ex.id ?? uuidv4() }))
            );
          }}
        );

    } else if (editMode) {
      setWorkout(testWorkout);
      setExerciseList(
        testWorkout.exercises!.map((ex) => ({ ...ex, id: ex.id ?? uuidv4() }))
      );
    }
  }, [editMode, workoutId]);

  /**
   * Submit the form and then navigate to the home screen. 
   */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    handleSubmitToLog(event);
    
    const form = event.currentTarget;
    const raw = Object.fromEntries(
      new FormData(form).entries()
    ) as Record<string,string>;

    const payload = transformFormData(raw);

    if (!editMode) {
      postWorkout(payload);
    }

    if (editMode) {
      updateWorkout(payload);
    }

    navigate("/");
  }

  const handleAddExerciseClick = () => {
    setPickerOpen(true);
  }

  const handleExerciseConfirm = (ex: Exercise) => {
    setExerciseList((prev) => [
      ...prev,
      {
        ...EMPTY_EXERCISE_HIST,
        exerciseId: ex.id!,
        name: ex.name,
        id: uuidv4(),
        exSets: [{ ...EMPTY_EXERCISE_HIST.exSets![0], id: uuidv4() }],
      },
    ]);
    setPickerOpen(false);
  }

  const removeExerciseClick = (exerciseIDToDelete: string | number | null | undefined) => {
    const nextExerciseList = exerciseList.filter(
      exercise => exercise.id !== exerciseIDToDelete
    );
    setExerciseList(nextExerciseList);
  }

  const clickDiscard = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    navigate("/");
  }

  return (
    <>
    <form id="workoutForm" onSubmit={handleSubmit}>

      {/* Workout Header Card*/}
      <div className={styles.card}>
        <input
          type="hidden"
          name="id"
          value={editMode && workout?.id ? workout.id : ""}
        />
        <div className={styles.headerRow}>
          <TextField
            type="text"
            sx={{ mb: 2, width: 400 }}
            id="workoutNameInput"
            name="workoutName"
            label="Workout Name"
            defaultValue={editMode && workout?.name ? workout.name : createDefaultWorkoutName()}
            onKeyDown={(e) => e.key === "Enter" ? e.preventDefault() : null}
          />
          {" "}
          <TextField
            type="datetime-local"
            sx={{ mb: 2 }}
            name="workoutDate"
            label="Workout Date"
            id="workoutDate"
            className={styles.workoutDateInput}
            defaultValue={
              editMode && workout?.date
              ? toDateTimeLocal(workout.date)
              : getLocalDateTimeString()
            }
          />
        </div>
        <TextField
          label="Workout Notes"
          name="workoutNotes"
          id="workoutNotes"
          multiline
          rows={4}
          fullWidth
          sx={{ overflow: "visible" }}
          defaultValue={
            editMode && workout?.notes
            ? workout.notes
            : ""
          }
        />
      </div>
      <div>
        {
          exerciseList.map((exHist, index) => (
            <ExerciseCard
              key={exHist.id}
              exercise={exHist}
              exerciseInputIndex={index}
            >
              <button
                className={styles.removeExerciseButton}
                disabled={exerciseList.length <= 1}
                onClick={() => removeExerciseClick(exHist.id)}
              >
                Remove Exercise
              </button>
            </ExerciseCard>
          ))
        }
      </div>
      <div>
        <AddExerciseButton onClick={handleAddExerciseClick}>
          +
        </AddExerciseButton>
        <ExercisePickerModal
          open={pickerOpen}
          onClose={() => setPickerOpen(false)}
          onConfirm={handleExerciseConfirm}
        />
      </div>
      <div>
        <button type="submit" className="submitWorkoutButton" >Submit</button>
        <button type="button" onClick={clickDiscard}>Discard</button>
      </div>
    </form>
    </>
  )
}