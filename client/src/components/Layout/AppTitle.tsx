import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useAppThemeContext } from "../../context/ThemeContext";

export default function AppTitle() {
  const {
    isMobile,
    title,
  } = useAppThemeContext();

  return (
    <Grid container spacing={1} flexGrow={1}>
      <Grid size={{ xs: 12, md: 6 }} >
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
          noWrap
        >
          The Log
        </Typography>
      </Grid>
      {isMobile
        ? null
        :
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            variant={"h5"}
            component="div"
            sx={{ flexGrow: 1 }}
            color="secondary"
            noWrap
          >
            {title}
          </Typography>
        </Grid>
      }
    </Grid>
  )
}