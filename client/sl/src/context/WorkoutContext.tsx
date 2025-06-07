import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useContext,
  useState
} from "react";
import { MaybeWorkout, Workout_Hist } from "../library/types";


interface WorkoutContextValue {
  workout: Workout_Hist | null;
  workoutContextMode: string;
  clearWorkout: () => void;
  setWorkout: Dispatch<SetStateAction<MaybeWorkout>>;
  setWorkoutContextMode: Dispatch<SetStateAction<string>>;
}

const WorkoutContext = createContext<WorkoutContextValue>({
  workout: null,
  workoutContextMode: "",
  clearWorkout: () => {},
  setWorkout: () => {},
  setWorkoutContextMode: () => {},
})

export const WorkoutProvider: FC<{ children: ReactNode }> = ({children}) => {
  const [workout, setWorkout] = useState<MaybeWorkout>(null);
  const [workoutContextMode, setWorkoutContextMode] = useState("");

  const clearWorkout = () => {
    setWorkout(null);
  }

  return (
    <WorkoutContext.Provider value={{
      workout,
      workoutContextMode,
      clearWorkout,
      setWorkout,
      setWorkoutContextMode,
    }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkoutContext = () => useContext(WorkoutContext);