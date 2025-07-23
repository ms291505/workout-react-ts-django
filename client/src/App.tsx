import { Routes, Route, Navigate } from 'react-router-dom';
import HomeScreen from './HomeScreen.tsx';
import Login from './components/Login.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import RecentWorkouts from './components/RecentWorkouts.tsx';
import ExerciseLibrary from './components/ExerciseLibrary/ExerciseLibrary.tsx';
import Register from './components/Register.tsx';
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import MainLayout from './components/MainLayout.tsx';
import StrengthWorkoutEntry from './components/StrengthWorkout/StrengthWorkoutEntry.tsx';
import { CENTER_COL_FLEX_BOX } from './styles/StyleOverrides.ts';

export default function App() {




  return (
      <Container
        maxWidth="lg"
      >
      <Box
        sx={{
          ...CENTER_COL_FLEX_BOX,
          minWidth: 0
        }}
      >
        <CssBaseline />
          <Routes>
            {/* Public Routes: */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes: */}
            <Route element={<ProtectedRoute />}>

              {/* Begin Main Latout: */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<HomeScreen />}>
                  <Route path="recent" element={<RecentWorkouts />} />
                  <Route path="" element={<Navigate to="recent" replace />} />
                  <Route path="exercise_library" element={<ExerciseLibrary buildWorkout />} />
                  <Route path="workout/new" element={<StrengthWorkoutEntry accessMode="new" />} />
                  <Route path="workout/edit/:workoutId" element={<StrengthWorkoutEntry accessMode="edit"/>} />
                </Route>
              </Route>
            </Route>
          </Routes>
      </Box>
      </Container>


  )
}