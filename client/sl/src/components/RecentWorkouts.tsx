import { useEffect, useState } from "react";
import { deleteWorkout, fetchWorkouts } from "../api";
import { Workout_Hist } from "../library/types";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { parseToWeekdayDate } from "../utils";
import { useWorkoutContext } from "../context/WorkoutContext";
import { useNavigate } from "react-router";
import Divider from "@mui/material/Divider";
import { useSnackbar } from "notistack";

export default function RecentWorkouts() {
  const navigate = useNavigate();

  const [workouts, setWorkouts] = useState<Workout_Hist[]>([]);
  const [loading, setLoading] = useState(true);
  const {enqueueSnackbar} = useSnackbar();

  const { setWorkout } = useWorkoutContext();

  const getWorkouts = async () => {
    const newWorkouts = await fetchWorkouts();
    newWorkouts.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });
    setWorkouts(newWorkouts);
    setLoading(false);
  }

  useEffect(() => {
    getWorkouts();
    }, []);

  const handleWorkoutEdit = (w: Workout_Hist) => {
    setWorkout(w as Workout_Hist);
    navigate(`/workout/edit/${w.id}`);
  }

  const handleWorkoutDelete = async (w: Workout_Hist) => {
    setLoading(true);

    try{
      const response = await deleteWorkout(w);
      if (response === true) enqueueSnackbar(`'${w.name}' was deleted.`);
      await getWorkouts();
    } catch (err) {
      console.error("Ann error occured while trying to delete.", err);
      if (err && typeof err === "object" && "name" in err) {
        const nameErrors = (err as any).name;
        const message = Array.isArray(nameErrors) ? nameErrors[0] : "An unkown Exercise Name error.";
        enqueueSnackbar(message, { variant: "error" });
      }
    } finally {
      setLoading(false);
    }

  }

  if (loading) {
    return <p>Your workouts are loading...</p>
  }

  if (workouts?.length > 0) return(
  <Grid container spacing={2} justifyContent="flex-start">
        {workouts?.map((w) => (
          <Grid key={w.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ p: 0 }} raised>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 1,
                    lineHeight: 1
                  }}
                >
                  {w.name}
                </Typography>
                <Typography
                  variant="body2"
                  component="p"
                  sx={{
                  }}
                >
                  {w.date && parseToWeekdayDate(w.date)}
                </Typography>
                <Divider
                  sx={{
                    mb: 1,
                    borderColor: "primary.main",
                    borderBottomWidth: 2
                  }}
                />
                <Typography
                  variant="body2"
                  component="p"
                  sx={{
                    display: '-webkit-box',
                    overflow: 'hidden',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 3,
                  }}
                >
                  {w.notes 
                    ? <><strong>Notes:</strong>{" "} {w.notes}</>
                    : "Notes: ..."
                  }
                </Typography>
              </CardContent>
              <CardActions
                sx={{pt: 0, pb: 1, px: 1}}
              >
                <Button
                  onClick={() => handleWorkoutEdit(w)}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleWorkoutDelete(w)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
    </Grid>
  )

}