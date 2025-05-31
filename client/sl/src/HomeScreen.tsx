import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";

export default function HomeScreen() {
  return (
    <>
        <Box>
          <Toolbar variant="dense" sx={{ mb: 2}}/>
          <Paper
            sx={{
              p: 2,
              m: 2
            }}
          >
            <Outlet />
          </Paper>
        </Box>
    </>
  )
}