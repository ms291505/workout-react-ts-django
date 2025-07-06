import { Workout_Hist } from "../../library/types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { parseToWeekdayDate } from "../../utils";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from "@mui/material/Paper";
import { Fragment } from "react/jsx-runtime";

interface Props {
  w: Workout_Hist | null;
}

export default function WorkoutSummary({
  w,
}: Props) {

  if (w === null) return(null);
  return(
    <Box>
      <Typography variant="h6">
        {w.name}
      </Typography>
      <Typography variant="body1">
        {w.date && parseToWeekdayDate(w.date)}
      </Typography>
      <Divider
        sx={{
          mb: 2,
          borderColor: "primary.main",
          borderBottomWidth: 2
        }}
      />
      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        sx={{
          maxHeight: 300,
          overflowY: "auto"
        }}
      >
      
      {
        w.exercises && w.exercises.map(e => (
          <Box key={e.id}>
          <Typography variant="body1" fontWeight="bold">
            {e.name}
          </Typography>
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
                  sx={{ width: "40%" }}
                >
                  Reps
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ width: "40%" }}
                >
                  {"Lbs"}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                e.exSets && e.exSets.map(s => (
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
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
          </TableContainer>
          </Box>
        ))
      }
      </Box>
    </Box>
  )
}