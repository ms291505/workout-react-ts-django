
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from "@mui/material/Paper";
import { ExSet } from '../../library/types';
import { useWorkoutContext } from '../../context/WorkoutContext';

interface Props {
  exSets: ExSet[] | null
}

export default function LongSummaryTable({
  exSets,
}: Props) {

  const { findSetType } = useWorkoutContext();

  if (!exSets || exSets.length === 0) return "No sets recorded.";
  return (
    <TableContainer component={Paper}>
      <Table
        size="small"
        stickyHeader
        sx={{
          width: "100%",
          tableLayout: "fixed"
        }}  
      >
        <TableHead>
          <TableRow>
            <TableCell
              sx={{ width: "20%" }}
            >
              Set
            </TableCell>
            <TableCell
              align="right"
              sx={{ width: "20%" }}
            >
              Reps
            </TableCell>
            <TableCell
              align="right"
              sx={{ width: "25%" }}
            >
              Lbs
            </TableCell>
            <TableCell
              align="right"
              sx={{ width: "35%" }}
            >
              Type
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { exSets.map(s => (
            <TableRow key={s.id}>
              <TableCell>
                {s.order}
              </TableCell>
              <TableCell align="right">
                {s.reps}
              </TableCell>
              <TableCell align="right">
                {s.weightLbs}
              </TableCell>
              <TableCell align="right">
                {findSetType(s.type)}
              </TableCell>
            </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </TableContainer>
  )
}