import { JSX } from "react";

/**
 * Provides the header row for a table displaying the ExSets of a workout. The columns are hardcoded in here,
 * might want to consider something more dynamic to handle changes to what should be displayed.
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