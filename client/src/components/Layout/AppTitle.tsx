import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAppThemeContext } from "../../context/ThemeContext";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

export default function AppTitle() {
  const {
    isMobile,
    title,
    toggleDarkMode
  } = useAppThemeContext();

  const {
    user,
    handleLogout
  } = useContext(AuthContext);

  return (
    <Grid
      container
      spacing={1}
      flexGrow={1}
      alignItems="center"
    >
      <Grid size={{ xs: 6, md: 2 }} >
        <Typography
          variant="h6"
          component="div"
          noWrap
        >
          The Log
        </Typography>
      </Grid>
      {isMobile
        ? null
        :
        <Grid size={{ md: 8 }} textAlign="center">
          <Typography
            variant={"h5"}
            color="secondary"
            noWrap
          >
            {title}
          </Typography>
        </Grid>
      }
      <Grid size={{ xs: 6, md: 2 }} textAlign="end">
        <Box>
          <IconButton
            size="large"
            color="inherit"
            onClick={toggleDarkMode}
          >
            <Brightness4Icon />
          </IconButton>
          {
            user && (
              <IconButton
                size="large"
                color="inherit"
                onClick={handleLogout}
              >
                <LogoutIcon />
              </IconButton>
            )
          }
        </Box>
      </Grid>
    </Grid>
  )
}