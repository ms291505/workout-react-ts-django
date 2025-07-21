
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

export default function ShortSummaryTable({
  exSets,
}: Props) {
  if (!exSets || exSets.length === 0) return <span>No sets recorded.</span>;

  const { exSetTypeChoices } = useWorkoutContext();

  const countSetsIfType = (exSets: ExSet[], setType: string): number => {
    return exSets.filter((set) => set.type === setType).length;
  }

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
              sx={{ width: "50%" }}
            >
              Set Type
            </TableCell>
            <TableCell
              align="right"
              sx={{ width: "50%" }}
            >
              Count
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { exSetTypeChoices.map(t => (
            countSetsIfType(exSets, t.value) > 0 &&
            <TableRow key={t.value}>
              <TableCell>
                {t.label} Sets
              </TableCell>
              <TableCell align="right">
                {
                  countSetsIfType(exSets, t.value)
                }
              </TableCell>
            </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </TableContainer>
  )
}