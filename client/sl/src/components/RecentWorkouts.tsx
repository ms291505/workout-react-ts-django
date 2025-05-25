import { useEffect, useState } from "react";
import { fetchWorkouts } from "../api";
import { Workout_Hist } from "../types";
import Link from "@mui/material/Link";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography"
import { parseToDate } from "../utils";


export default function RecentWorkouts() {

  const [workouts, setWorkouts] = useState<Workout_Hist[] | null>(null);
  const [loading, setLoading] = useState(true);

  const getWorkouts = async () => {
    const newWorkouts = await fetchWorkouts();
    setWorkouts(newWorkouts);
    setLoading(false);
    console.log(newWorkouts);
  }

  useEffect(() => {
    getWorkouts();
    }, []);

  if (loading) {
    return <p>Your workouts are loading...</p>
  }

  return(
  <Grid container component="div" spacing={2} justifyContent="flex-start" alignItems="flex-start">
        {workouts?.map((workout) => (
          <Grid key={workout.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ p: 0 }} raised>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    lineHeight: 1
                  }}
                >
                  {workout.name}
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
                  Date: {workout.date && parseToDate(workout.date)}
                </Typography>
                {workout.notes 
                  ? <p>Notes: {workout.notes}</p>
                  : <p>Notes: ...</p>
                }
              </CardContent>
              <CardActions
                sx={{pt: 0, pb: 1, px: 1}}
              >
                <Link href={`/workout/${workout.id}/edit`} underline="hover">
                  Edit
                </Link>
              </CardActions>
            </Card>
          </Grid>
        ))}
    </Grid>
  )

}