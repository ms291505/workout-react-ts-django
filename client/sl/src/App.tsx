import { Routes, Route, Navigate } from 'react-router-dom';
import WorkoutForm from './WorkoutForm';
import HomeScreen from './HomeScreen';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import RecentWorkouts from './components/RecentWorkouts';
import ExerciseLibrary from './components/ExerciseLibrary';
import Register from './components/Register';
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import MainLayout from './components/MainLayout';
import { useAppThemeContext } from './context/ThemeContext.tsx';
import { ThemeProvider } from '@mui/material';
import StrengthWorkoutEntry from './components/StrengthWorkout/StrengthWorkoutEntry.tsx';
import { SnackbarProvider, closeSnackbar } from "notistack";
import { MAX_SNACK, NOTISTACK_DURATION } from './library/constants.ts';

export default function App() {


  const { theme } = useAppThemeContext();


  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth="lg"
      >
      <Box
        sx={{ display: "flex" }}
      >
        <CssBaseline />
        <SnackbarProvider
          maxSnack={MAX_SNACK}
          autoHideDuration={NOTISTACK_DURATION}
          action={(snackbarId) => (
            <button 
              onClick={() => closeSnackbar(snackbarId)}
              style={{
                background: "none",
                border: "none",
                color: "inherit",
                textDecoration: "underline",
                cursor: "pointer",
                padding: 0,
                font: "inherit",
              }}
            >
              {" close "}
            </button>
          )}  
        >
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
                  <Route path="exercise_library" element={<ExerciseLibrary />} />
                  <Route path="" element={<Navigate to="recent" replace />} />
                  <Route path="workout" element={<WorkoutForm />} />
                  <Route path="workout/:workoutId/edit" element={<WorkoutForm editMode />} />
                  <Route path="workout_crud/:workoutId/:accessMode" element={<StrengthWorkoutEntry />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </SnackbarProvider>
      </Box>
      </Container>
    </ThemeProvider>


  )
}