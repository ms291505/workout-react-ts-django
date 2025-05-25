import { ReactNode,  } from "react";
import type { ExSet } from "./types.ts";
import { useSetTypeChoices } from "./hooks/useSetTypeChoices.ts";
import { MenuItem, TextField } from "@mui/material";
import styles from "./SetRow.module.css";

/**
 * Row for an Exercise Set.
 * 
 * _NOTE: Children are in a `<td>` element._
 * 
 * Expected columns for table row:
 *  1. Set Number
 *  2. Weight
 *  3. Reps
 *  4. Set Type
 */
export default function SetRow({ exSet, setOrder = 0, exerciseInputIndex = -1, children }: {
    exSet: ExSet;
    setOrder?: number;
    exerciseInputIndex?: number;
    children?: ReactNode;
  }) {
  
  const { choices: exSetTypeChoices, loading } = useSetTypeChoices();

  const defaultType =
    exSet.type ??
    (exSetTypeChoices.length > 0 ? String(exSetTypeChoices[0].value) : "");

  const exSetIndices = `[${exerciseInputIndex}][${setOrder - 1}]`;
  const weightInputName = `weight${exSetIndices}`;
  const repsInputName = `reps${exSetIndices}`;
  const setTypeInputName = `setType${exSetIndices}`;
  const exSetIdName = `exSetId${exSetIndices}`;
  const weightLabel = "lbs";

  return (
    <tr>
      <td>
        {setOrder} {/* Showing the prop that is passed through always. */}
      </td>
      <td>
        <TextField
          type="text"
          className={styles.weightInput}
          name={ weightInputName }
          id={ weightInputName }
          defaultValue={exSet?.weightLbs ? exSet.weightLbs : ""}
          label={ weightLabel }
          aria-label="Weight"
          slotProps={{
            input: {
              inputMode: "decimal",
              inputProps: {
                pattern: "\\d+(\\.\\d+)?"
              },
            },
          }}
        />
        <input
          type="hidden"
          name={ exSetIdName }
          value={ exSet.id ? exSet.id : "" }
        />
      </td>
      <td>
        <TextField
          type="number"
          name={ repsInputName }
          id={ repsInputName }
          defaultValue={exSet?.reps ? exSet.reps : ""}
          label="Reps"
          aria-label="Reps"
          className={styles.repsInput}
        />
      </td>
      <td>
        {loading ? (
          "Loading types..."
        ) : (
            <TextField
              select
              name={ setTypeInputName }
              defaultValue={ defaultType }
              className={styles.typeInput}
              label="Set Type"
            >
              {
                exSetTypeChoices.map(({ value, label }) => (
                  <MenuItem value={ value } key={ value } >{ label }</MenuItem>
                ))
              }
            </TextField>
        )}
      </td>
      <td>
        { children }
      </td>
    </tr>
  )

}