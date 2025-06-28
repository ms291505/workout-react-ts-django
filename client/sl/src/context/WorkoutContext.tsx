import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useContext,
  useState
} from "react";
import { Exercise, MaybeWorkout, Workout_Hist } from "../library/types";


interface WorkoutContextValue {
  workout: Workout_Hist | null;
  workoutContextMode: string;
  exSelections: Exercise[];
  clearWorkout: () => void;
  setWorkout: Dispatch<SetStateAction<MaybeWorkout>>;
  setWorkoutContextMode: Dispatch<SetStateAction<string>>;
  setExSelections: Dispatch<SetStateAction<Exercise[]>>;
}

const WorkoutContext = createContext<WorkoutContextValue>({
  workout: null,
  workoutContextMode: "",
  exSelections: [],
  clearWorkout: () => {},
  setWorkout: () => {},
  setWorkoutContextMode: () => {},
  setExSelections: () => {},
})

export const WorkoutProvider: FC<{ children: ReactNode }> = ({children}) => {
  const [workout, setWorkout] = useState<MaybeWorkout>(null);
  const [workoutContextMode, setWorkoutContextMode] = useState<string>("");

  const [exSelections, setExSelections] = useState<Exercise[]>([]);

  const clearWorkout = () => {
    setWorkout(null);
  }

  return (
    <WorkoutContext.Provider value={{
      workout,
      workoutContextMode,
      exSelections,
      clearWorkout,
      setWorkout,
      setWorkoutContextMode,
      setExSelections,
    }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkoutContext = () => useContext(WorkoutContext);