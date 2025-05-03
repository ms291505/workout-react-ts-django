import styles from "./ExerciseCard.module.css";
import { useState } from "react";
import SetRow from "./SetRow.js";
import { EMPTY_EX_SET } from "./constants.ts";
import SetTableHeader from "./SetTableHeader.tsx";
import { v4 as uuidv4 } from "uuid";

/** @typedef {import("./types.js").ExSet} */
/** @typedef {import("./types.js").Exercise} */

/**
 * A card for an exercise.
 * @param {{
 *  exercise?: Exercise,
 *  exerciseInputIndex?: number,
 *  children: any
 * }} props 
 * @returns 
 */
export default function ExerciseCard({
  exercise = null,
  exerciseInputIndex = 0,
  children
}) {
  const exerciseInputName = `exerciseName[${ exerciseInputIndex }]`;
  const exerciseInputNotes = `exerciseNotes[${ exerciseInputIndex }]`;
  
  const [setList, setSetList] = useState(
    exercise.exSets.length > 0
    ? exercise.exSets.slice()
    : [{...EMPTY_EX_SET, id: uuidv4()},]);
  const [exerciseName, setExerciseName] = useState(
    exercise.name != ""
    ? exercise.name
    : "");

  const addSetClick = () => {
    const nextSetList = setList.slice();
    nextSetList.push({...EMPTY_EX_SET, id:uuidv4()});
    setSetList(nextSetList);
  }

  const removeSetClick = (setIDToDelete) => {
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
          defaultValue={exerciseName}
          onChange={(e) => setExerciseName(e.target.value)}
          onKeyDown={(e) => {
            e.key === "Enter" && e.preventDefault();
          }}
          required
        />
        {children}
      </div>
      <div className={styles.row}>
        <textarea
          className={styles.exNotes}
          name={ exerciseInputNotes }
          id={ exerciseInputNotes }
          placeholder="Exercise notes..."
          defaultValue={exercise.notes != "" ? exercise.notes : ""}
        />
      </div>
      <table>
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
                <button
                  className={styles.removeSetButton}
                  disabled={setList.length <= 1}
                  onClick={() => removeSetClick(exSet.id)}
                >
                  Remove
                </button>
              </SetRow>
            ))
          }
        </tbody>
      </table>
      <button type="button" onClick={addSetClick}>Add Set</button>
    </div>
  );
}