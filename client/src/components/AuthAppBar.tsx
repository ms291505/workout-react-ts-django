
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton"
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Typography from "@mui/material/Typography";
import { useAppThemeContext } from "../context/ThemeContext";
import Brightness4Icon from "@mui/icons-material/Brightness4";

export default function AuthAppBar() {
  const { toggleDarkMode } = useAppThemeContext();

  return (
    <Box>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar variant="dense">
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            sx={{ mr: 2, display: { sm: "none" } }}
            disabled
          >
            <MenuBookIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
            noWrap
          >
            The Log
          </Typography>
          <IconButton
            size="large"
            color="inherit"
            onClick={toggleDarkMode}
          >
            <Brightness4Icon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  )
}