import { ReactNode,  } from "react";
import type { ExSet } from "./types.ts";
import { useSetTypeChoices } from "./hooks/useSetTypeChoices.ts";
import { Select, MenuItem } from "@mui/material";

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
    (exSetTypeChoices.length > 0 ? exSetTypeChoices[0].value : "");

  const exSetIndices = `[${exerciseInputIndex}][${setOrder - 1}]`;
  const weightInputName = `weight${exSetIndices}`;
  const repsInputName = `reps${exSetIndices}`;
  const setTypeInputName = `setType${exSetIndices}`;
  const exSetIdName = `exSetId${exSetIndices}`;

  return (
    <tr>
      <td>
        {setOrder} {/* Showing the prop that is passed through always. */}
      </td>
      <td>
        <input
          type="number"
          name={ weightInputName }
          id={ weightInputName }
          defaultValue={exSet?.weightLbs ? exSet.weightLbs : ""}
          required
        />
        <input
          type="hidden"
          name={ exSetIdName }
          value={ exSet.id ? exSet.id : "" }
        />
      </td>
      <td>
        <input
          type="number"
          name={ repsInputName }
          id={ repsInputName }
          defaultValue={exSet?.reps ? exSet.reps : ""}
          required
        />
      </td>
      <td>
        {loading ? (
          "Loading types..."
        ) : (
        <Select
          name={ setTypeInputName }
          defaultValue={ defaultType }
        >
          {
            exSetTypeChoices.map(({ value, label }) => (
              <MenuItem value={ value } key={ value } >{ label }</MenuItem>
            ))
          }
        </Select>
        )}
      </td>
      <td>
        { children }
      </td>
    </tr>
  )

}