// @ts-check

import styles from "./WorkoutForm.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleSubmitToLog } from "./utils";
import ExerciseCard from "./ExerciseCard";
import { EMPTY_EXERCISE, testWorkout } from "./constants";
import { v4 as uuidv4 } from "uuid";
import AddExerciseButton from "./AddExerciseButton";
import { Workout } from "./types";

/**
 * The form that handles entering, editting, and submitting workout data.
 */
export default function WorkoutForm({editMode = false, workout = testWorkout}: {
  editMode?: boolean,
  workout?: Workout
}) {
  const navigate = useNavigate();

  // State for list of exercises on a workout.
  const [exerciseList, setExerciseList] = useState(
    editMode && workout.exercises
      ? workout.exercises.slice()
      : [{...EMPTY_EXERCISE, id: uuidv4()},]
  );

  /**
   * Submit the form and then navigate to the home screen. 
   */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    handleSubmitToLog(event);
    navigate("/");
  }

  const clickAddExercise = () => {
    const nextExerciseList = exerciseList.slice();
    nextExerciseList.push({...EMPTY_EXERCISE, id: uuidv4()});
    setExerciseList(nextExerciseList);
  }

  const removeExerciseClick = (exerciseIDToDelete) => {
    const nextExerciseList = exerciseList.filter(
      exercise => exercise.id !== exerciseIDToDelete
    );
    setExerciseList(nextExerciseList);
  }

  const clickDiscard = (event) => {
    event.preventDefault();
    navigate("/");
  }

  return (
    <>
    <form id="workoutForm" onSubmit={handleSubmit}>
      {/* Workout Header Card*/}
      <div className={styles.card}>
        <input
          className={styles.workoutNameInput}
          type="text"
          id="workoutNameInput"
          name="workoutName"
          placeholder="Workout name..."
          defaultValue={editMode && workout?.name ? workout.name : ""}
          onKeyDown={(e) => {
            e.key === "Enter" && e.preventDefault();
          }}
        />
        <input
          type="date"
          name="workoutDate"
          id="workoutDate"
          className={styles.workoutDateInput}
          defaultValue={
            editMode && workout?.date
            ? workout.date
            : ""
          }
        />
        <textarea
          name="workoutNotes"
          id="workoutNotes"
          className={styles.workoutNotesInput}
          placeholder="Workout notes..."
          defaultValue={
            editMode && workout.notes
            ? workout.notes
            : ""
          }
        ></textarea>
      </div>
      <div>
        {
          exerciseList.map((exercise, index) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              exerciseInputIndex={index}
            >
              <button
                className={styles.removeExerciseButton}
                disabled={exerciseList.length <= 1}
                onClick={() => removeExerciseClick(exercise.id)}
              >
                Remove Exercise
              </button>
            </ExerciseCard>
          ))
        }
      </div>
      <div>
        <AddExerciseButton onClick={clickAddExercise}>
          +
        </AddExerciseButton>
      </div>
      <div>
        <button type="submit" className="submitWorkoutButton" >Submit</button>
        <button type="button" onClick={clickDiscard}>Discard</button>
      </div>
    </form>
    </>
  )
}