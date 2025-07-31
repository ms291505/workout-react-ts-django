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
import {
  Choice,
  Exercise,
  MaybeWorkout,
  TmplWorkoutHist,
  Workout_Hist
} from "../library/types";
import { fetchSetTypeChoice, fetchTemplateByWorkout } from "../api";


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
  findSetType: (searchValue: string | null) => string;
  workoutTemplate: TmplWorkoutHist | null;
  setWorkoutTemplate: Dispatch<SetStateAction<TmplWorkoutHist | null>>
}

const WorkoutContext = createContext<WorkoutContextValue>({
  workout: null,
  workoutContextMode: "",
  exSelections: [],
  clearWorkout: () => { },
  setWorkout: () => { },
  setWorkoutContextMode: () => { },
  setExSelections: () => { },
  exSetTypeChoices: [],
  setExSetTypeChoices: () => { },
  handleOneChange: () => { },
  findSetType: () => "",
  workoutTemplate: null,
  setWorkoutTemplate: () => { },
})

export const WorkoutProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [workout, setWorkout] = useState<MaybeWorkout>(null);
  const [workoutContextMode, setWorkoutContextMode] = useState<string>("");
  const [exSetTypeChoices, setExSetTypeChoices] = useState<Choice[]>([]);
  const [workoutTemplate, setWorkoutTemplate] = useState<TmplWorkoutHist | null>(null);

  const [exSelections, setExSelections] = useState<Exercise[]>([]);

  const clearWorkout = () => {
    setWorkout(null);
  }

  const handleOneChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setWorkout(previous => ({ ...previous, [name]: value } as Workout_Hist));
  }

  useEffect(() => {
    fetchSetTypeChoice()
      .then((data) => setExSetTypeChoices(data))
  }, [])

  useEffect(() => {
    if (!workout || workout.id == null) return;
    fetchTemplateByWorkout(workout.id!)
      .then((data) => {
        if (data.length > 0) {
          setWorkoutTemplate(data[data.length - 1]);
        }
        else setWorkoutTemplate(null);
      })
      .catch((error) => {
        console.error("Failed to fetch template by workout:", error);
        setWorkoutTemplate(null);
      })
  }, [workout?.id])

  const findSetType = (searchValue: string | null) => {
    const match = exSetTypeChoices.find(t => t.value === searchValue);
    return match?.label || "Error";
  };

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
      handleOneChange,
      findSetType,
      workoutTemplate,
      setWorkoutTemplate
    }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkoutContext = () => useContext(WorkoutContext);
