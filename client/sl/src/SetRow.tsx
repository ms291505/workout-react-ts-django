import { useState, ReactNode, ChangeEvent } from "react";
import { EX_SET_TYPE_LIST } from "./constants.ts";
import type { ExSet } from "./types.ts";

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
  const [setType, setSetType] = useState(exSet.type ? exSet.type : EX_SET_TYPE_LIST[0]);

  const handleSetTypeChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setSetType(event.target.value);
  }

  const exSetIndices = `[${exerciseInputIndex}][${setOrder - 1}]`;
  const weightInputName = `weight${exSetIndices}`;
  const repsInputName = `reps${exSetIndices}`;
  const setTypeInputName = `setType${exSetIndices}`;

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
        <select
          name={ setTypeInputName }
          id={ setTypeInputName }
          value={ setType }
          onChange={ handleSetTypeChange }
        >
          {
            EX_SET_TYPE_LIST.map(type => (
              <option value={ type } key={ type } >{ type }</option>
            ))
          }
        </select>
      </td>
      <td>
        { children }
      </td>
    </tr>
  )

}