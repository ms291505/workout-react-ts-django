import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useContext,
  useState
} from "react";
import { Cardio_Workout_Hist } from "../library/cardioTypes";
import { Workout_Hist } from "../library/types";


interface WorkoutContextValue {
  workout: Workout_Hist | Cardio_Workout_Hist | null;
  clearWorkout: () => void;
  setWorkout: Dispatch<SetStateAction<null>>;
}

const WorkoutContext = createContext<WorkoutContextValue>({
  workout: null,
  clearWorkout: () => {},
  setWorkout: () => {},
})

export const WorkoutProvider: FC<{ children: ReactNode }> = ({children}) => {
  const [workout, setWorkout] = useState(null);

  const clearWorkout = () => {
    setWorkout(null);
  }

  return (
    <WorkoutContext.Provider value={{
      workout,
      clearWorkout,
      setWorkout
    }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkoutContext = () => useContext(WorkoutContext);