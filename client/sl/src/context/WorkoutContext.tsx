import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
  useEffect
} from "react";
import { Choice, Exercise, MaybeWorkout, Workout_Hist } from "../library/types";
import { fetchSetTypeChoice } from "../api";


interface WorkoutContextValue {
  workout: Workout_Hist | null;
  workoutContextMode: string;
  exSelections: Exercise[];
  clearWorkout: () => void;
  setWorkout: Dispatch<SetStateAction<MaybeWorkout>>;
  setWorkoutContextMode: Dispatch<SetStateAction<string>>;
  setExSelections: Dispatch<SetStateAction<Exercise[]>>;
  exSetTypeChoices: Choice[];
  setExSetTypeChoices: Dispatch<SetStateAction<Choice[]>>;
}

const WorkoutContext = createContext<WorkoutContextValue>({
  workout: null,
  workoutContextMode: "",
  exSelections: [],
  clearWorkout: () => {},
  setWorkout: () => {},
  setWorkoutContextMode: () => {},
  setExSelections: () => {},
  exSetTypeChoices: [],
  setExSetTypeChoices: () => {},
})

export const WorkoutProvider: FC<{ children: ReactNode }> = ({children}) => {
  const [workout, setWorkout] = useState<MaybeWorkout>(null);
  const [workoutContextMode, setWorkoutContextMode] = useState<string>("");
  const [exSetTypeChoices, setExSetTypeChoices] = useState<Choice[]>([]);

  const [exSelections, setExSelections] = useState<Exercise[]>([]);

  const clearWorkout = () => {
    setWorkout(null);
  }

  useEffect(() =>{
    fetchSetTypeChoice()
      .then((data) => setExSetTypeChoices(data))
  }, [])

  return (
    <WorkoutContext.Provider value={{
      workout,
      workoutContextMode,
      exSelections,
      clearWorkout,
      setWorkout,
      setWorkoutContextMode,
      setExSelections,
      exSetTypeChoices,
      setExSetTypeChoices
    }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkoutContext = () => useContext(WorkoutContext);