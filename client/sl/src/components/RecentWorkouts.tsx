import { useEffect, useState } from "react";
import { fetchWorkouts } from "../api";
import { Workout_Hist } from "../types";
import styles from "../styles/RecentWorkouts.module.css";


export default function RecentWorkouts() {

  const [workouts, setWorkouts] = useState<Workout_Hist[] | null>(null);
  const [loading, setLoading] = useState(true);

  const getWorkouts = async () => {
    const newWorkouts = await fetchWorkouts();
    setWorkouts(newWorkouts);
    setLoading(false);
    console.log(newWorkouts)
  }

  useEffect(() => {
    getWorkouts();
    }, []);

  return(
    <div className={styles.container}>
      {loading && (
        <p>Your workokouts are loading...</p>
      )}

      {!loading && workouts?.map((workout) => (
        <p key={workout.id}>{workout.id} / {workout.name} / {workout.date}</p>
      ))}
    </div>
  )

}