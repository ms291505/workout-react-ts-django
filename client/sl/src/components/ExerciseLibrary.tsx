import { Exercise } from "../types";
import { fetchExercises } from "../api";
import { useEffect, useState } from "react";
import styles from "../styles/ExerciseLibrary.module.css";

export default function ExerciseLibrary() {

  const [exercises, setExercises] = useState<Exercise[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getExercises = async () => {
    const newExercises = await fetchExercises();
    setExercises(newExercises);
    setLoading(false);
  }

  useEffect(() => {
    getExercises();
  }, []);

  return (
    <div className={styles.container}>
      {
        loading && (
          <p>The library is loading...</p>
        )
      }
      {
        !loading && exercises?.map((exercise) => (
          <p key={exercise.id}>{exercise.id} / {exercise.name}</p>
        ))
      }
    </div>
  )
}