import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
  useEffect,
  ChangeEvent
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
  handleOneChange: (event: ChangeEvent<HTMLInputElement>) => void;
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
  handleOneChange: () => {},
})

export const WorkoutProvider: FC<{ children: ReactNode }> = ({children}) => {
  const [workout, setWorkout] = useState<MaybeWorkout>(null);
  const [workoutContextMode, setWorkoutContextMode] = useState<string>("");
  const [exSetTypeChoices, setExSetTypeChoices] = useState<Choice[]>([]);

  const [exSelections, setExSelections] = useState<Exercise[]>([]);

  const clearWorkout = () => {
    setWorkout(null);
  }
  
  const handleOneChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setWorkout(previous => ({ ...previous, [name]: value } as Workout_Hist));
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
      setExSetTypeChoices,
      handleOneChange
    }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkoutContext = () => useContext(WorkoutContext);