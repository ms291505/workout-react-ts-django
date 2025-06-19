import DrawerContent from "./DrawerContent";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton"
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import { useContext, useState } from "react";
import { useAppThemeContext } from "../context/ThemeContext";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import LogoutIcon from "@mui/icons-material/Logout";
import { AuthContext } from "../context/AuthContext";

export default function WorkoutAppBar() {

  const [open, setOpen] = useState(false);
  const { toggleDarkMode, isMobile } = useAppThemeContext();
  const { user, handleLogout } = useContext(AuthContext);

  const drawerWidth = 200;

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
            onClick={() => setOpen(prev => !prev)}
            sx={{ mr: 2, display: { sm: "none" } }}
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
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 }
        }}
        aria-label="navigation bar"
      >
        <Drawer
          variant="temporary"
          open={open}
          onClose={() => setOpen(false)}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          slotProps={{
            root: {
              keepMounted: true,
            },
          }}
        >
          <DrawerContent onClose={isMobile? () => setOpen(false) : undefined} />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: "none", sm: "block" },
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          }}
          open
        >
          <DrawerContent />
        </Drawer>
      </Box>
    </Box>
  )
}