import DrawerContent from "./DrawerContent";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton"
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Drawer from "@mui/material/Drawer";
import { Fragment, useContext, useState } from "react";
import { useAppThemeContext } from "../context/ThemeContext";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import LogoutIcon from "@mui/icons-material/Logout";
import { AuthContext } from "../context/AuthContext";
import { DRAWER_WIDTH } from "../library/constants";
import Container from "@mui/material/Container";
import NavList from "./NavList";
import Button from "@mui/material/Button";
import { navBarRoutes } from "../library/navBarRoutes";
import Divider from "@mui/material/Divider";
import { useNavigate } from "react-router";
import AppTitle from "./Layout/AppTitle";

export default function WorkoutAppBar() {

  const [open, setOpen] = useState(false);
  const { toggleDarkMode, isMobile, setTitle } = useAppThemeContext();
  const { user, handleLogout } = useContext(AuthContext);

  const navigate = useNavigate();

  const drawerWidth = DRAWER_WIDTH;

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar variant="dense">
          <Container
            maxWidth="lg"
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                onClick={() => setOpen(prev => !prev)}
                sx={{ mr: 2, display: { md: "none" } }}
              >
                <MenuBookIcon />
              </IconButton>
              <AppTitle />
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
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                flexDirection: "row",
                alignItems: "center",
                justifyItems: "center",
                justifyContent: "center"
              }}
            >
              {
                navBarRoutes.map((n, idx) => (
                  <Fragment
                    key={n.name}
                  >
                    <Button
                      size="small"
                      color="secondary"
                      sx={{
                        fontWeight: "bold"
                      }}
                      onClick={() => {
                        navigate(n.route);
                        setTitle(n.name);
                      }}
                    >
                      {n.name}
                    </Button>
                    {
                      idx + 1 < navBarRoutes.length
                        ? <Divider
                          orientation="vertical"
                          flexItem
                          color="secondary"
                          sx={{
                            borderRightWidth: 2,
                            mr: 1,
                            ml: 1,
                          }}
                        />
                        : null
                    }
                  </Fragment>
                ))
              }
            </Box>
          </Container>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          width: { sm: 0 },
          flexShrink: { sm: 0 }
        }}
        aria-label="navigation bar"
      >
        <Drawer
          variant="temporary"
          open={open}
          onClose={() => setOpen(false)}
          sx={{
            display: { sm: 'block', med: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          slotProps={{
            root: {
              keepMounted: true,
            },
          }}
        >
          <DrawerContent>
            <NavList
              onClose={isMobile ? () => setOpen(false) : undefined}
            />
          </DrawerContent>
        </Drawer>
      </Box>
    </>
  )
}