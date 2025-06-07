import { useEffect, useState } from "react";
import { fetchWorkouts } from "../api";
import { Workout_Hist } from "../library/types";
import Link from "@mui/material/Link";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { parseToDate } from "../utils";
import { useWorkoutContext } from "../context/WorkoutContext";
import { useNavigate } from "react-router";


export default function RecentWorkouts() {
  const navigate = useNavigate();

  const [workouts, setWorkouts] = useState<Workout_Hist[] | null>(null);
  const [loading, setLoading] = useState(true);

  const { setWorkout } = useWorkoutContext();

  const getWorkouts = async () => {
    const newWorkouts = await fetchWorkouts();
    setWorkouts(newWorkouts);
    setLoading(false);
    console.log(newWorkouts);
  }

  useEffect(() => {
    getWorkouts();
    }, []);

  const handleWorkoutEdit = (w: Workout_Hist) => {
    setWorkout(w as Workout_Hist);
    navigate(`/workout_crud/${w.id}/edit`);
  }

  if (loading) {
    return <p>Your workouts are loading...</p>
  }

  return(
  <Grid container component="div" spacing={2} justifyContent="flex-start" alignItems="flex-start">
        {workouts?.map((w) => (
          <Grid key={w.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ p: 0 }} raised>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    lineHeight: 1
                  }}
                >
                  {w.name}
                </Typography>
                <Typography
                  variant="body2"
                  component="p"
                  sx={{
                    mb:0,
                    mt:0,
                    lineHeight:0
                  }}

                >
                  Date: {w.date && parseToDate(w.date)}
                </Typography>
                {w.notes 
                  ? <p>Notes: {w.notes}</p>
                  : <p>Notes: ...</p>
                }
              </CardContent>
              <CardActions
                sx={{pt: 0, pb: 1, px: 1}}
              >
                <Link href={`/workout/${w.id}/edit`} underline="hover">
                  Edit
                </Link>
                <Button
                  onClick={() => handleWorkoutEdit(w)}
                >
                  Edit
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
    </Grid>
  )

}