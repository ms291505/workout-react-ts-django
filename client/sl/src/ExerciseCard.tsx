// ExerciseCard.tsx

import styles from "./ExerciseCard.module.css";
import { ReactNode, useEffect, useState } from "react";
import SetRow from "./SetRow.js";
import { EMPTY_EX_SET } from "./constants.ts";
import SetTableHeader from "./SetTableHeader.tsx";
import { v4 as uuidv4 } from "uuid";
import { Exercise_Hist, ExSet } from "./types.ts";
import { handleKeyDownPD } from "./utils.tsx";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface ExerciseCardProps {
  exercise: Exercise_Hist;
  exerciseInputIndex: number;
  children?: ReactNode;
}

export default function ExerciseCard({
  exercise,
  exerciseInputIndex,
  children,
}: ExerciseCardProps) {
  const exerciseInputName = `exerciseName[${ exerciseInputIndex }]`;
  const exerciseInputNotes = `exerciseNotes[${ exerciseInputIndex }]`;
  const exerciseDBID = `exerciseId[${ exerciseInputIndex }]`;
  const exerciseHistID = `exerciseHistId[${ exerciseInputIndex}]`;
  
  //pick up HERE
  const [setList, setSetList] = useState<ExSet[]>(
    [
      { ...EMPTY_EX_SET, id: uuidv4() }
    ]
  );

  useEffect(() => {
    if (exercise.exSets?.length) {
      setSetList(exercise.exSets);
    } else {
      setSetList([{ ...EMPTY_EX_SET, id: uuidv4() }]);
    }
  }, [exercise])

  const [exerciseName, setExerciseName] = useState(
    exercise.name != ""
    ? exercise.name
    : "");

  const addSetClick = () => {
    const nextSetList = setList.slice();
    nextSetList.push({...EMPTY_EX_SET, id:uuidv4()});
    setSetList(nextSetList);
  }

  const removeSetClick = (setIDToDelete: string | number | null | undefined) => {
    const nextSetList = setList.filter(exSet => exSet.id !== setIDToDelete);
    setSetList(nextSetList);
  }

  return (
    <div className={styles.card}>
      <div className={styles.row}>
        <input
          type="text"
          name={ exerciseInputName }
          id={ exerciseInputName }
          placeholder="Exercise name..."
          defaultValue={exerciseName ?? ""}
          onChange={(e) => setExerciseName(e.target.value)}
          onKeyDown={handleKeyDownPD}
          required
        />
        {children}
        <input
          type="hidden"
          readOnly
          name={ exerciseDBID }
          value={exercise.exerciseId ?? ""}
        />
        <input
          type="hidden"
          readOnly
          name={ exerciseHistID }
          value={ exercise.id ?? ""}
        />
      </div>
      <div className={styles.row}>
        <textarea
          className={styles.exNotes}
          name={ exerciseInputNotes }
          id={ exerciseInputNotes }
          placeholder="Exercise notes..."
          defaultValue={exercise.notes ?? ""}
        />
      </div>
      <table className={styles.exSetTable}>
        <SetTableHeader />
        <tbody>
          {
            setList.map((exSet, index) => (
              <SetRow
                key={exSet.id}
                exSet={exSet}
                setOrder={index + 1}
                exerciseInputIndex={exerciseInputIndex}
              >
                <IconButton
                  className={styles.removeSetButton}
                  disabled={setList.length <= 1}
                  onClick={() => removeSetClick(exSet.id)}
                  aria-label="delete the set"
                >
                  <DeleteIcon />
                </IconButton>
              </SetRow>
            ))
          }
        </tbody>
      </table>
      <button type="button" onClick={addSetClick}>Add Set</button>
    </div>
  );
}