import { Outlet } from "react-router";
import Box from "@mui/material/Box";
import WorkoutAppBar from "./WorkoutAppBar";

export default function MainLayout() {

  return (
    <>
      <WorkoutAppBar />
      <Box>
      </Box>
      <Box
        sx={{
          mb: 5
        }}
      >
        <Outlet />
      </Box>
    </>
  )
}