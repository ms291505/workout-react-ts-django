import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import MobileTitle from "./MobileTitle";

export default function HomeScreen() {
  return (
    <>
      <Box>
        <Toolbar variant="dense" sx={{ mb: { xs: 1, md: 5 } }} />
        <MobileTitle />
        <Outlet />
      </Box>
    </>
  )
}