import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

export default function HomeScreen() {
  return (
    <>
        <Box>
          <Toolbar variant="dense" sx={{ mb: {xs: 1, md: 5}}}/>
            <Outlet />
        </Box>
    </>
  )
}