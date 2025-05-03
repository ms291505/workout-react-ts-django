import { JSX } from "react";

/**
 * Provides the header row for a table displaying the ExSets of a workout.
 * 
 */
export default function SetTableHeader(): JSX.Element {
  return (
    <thead>
      <tr>
        <th>Set</th>
        <th>Weight</th>
        <th>Reps</th>
        <th>Type</th>
      </tr>
    </thead>
  );
}