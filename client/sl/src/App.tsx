import { Routes, Route, Navigate } from 'react-router-dom';
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
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

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
          hideIconVariant
          maxSnack={MAX_SNACK}
          autoHideDuration={NOTISTACK_DURATION}
          action={(snackbarId) => (
            <IconButton
              size="small"
              onClick={() => closeSnackbar(snackbarId)}
            >
              <CloseIcon
                fontSize="small"
              />
            </IconButton>
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
                  <Route path="" element={<Navigate to="recent" replace />} />
                  <Route path="exercise_library" element={<ExerciseLibrary />} />
                  <Route path="workout/new" element={<StrengthWorkoutEntry accessMode="new" />} />
                  <Route path="workout/edit/:workoutId" element={<StrengthWorkoutEntry accessMode="edit"/>} />
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