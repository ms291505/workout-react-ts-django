import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import './App.css'
import PageHeader from './components/PageHeader';
import WorkoutForm from './WorkoutForm';
import HomeScreen from './HomeScreen';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import RecentWorkouts from './components/RecentWorkouts';
import ExerciseLibrary from './components/ExerciseLibrary';

function MainLayout() {
  return (
    <>
      <PageHeader />
      <div>
        <Outlet />
      </div>
    </>
  )
}


export default function App() {
  return (
    <Routes>
      {/* Public Routes: */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes: */}
      <Route element={<ProtectedRoute />}>
       <Route element={<MainLayout />}>
        <Route path="/" element={<HomeScreen />}>
          <Route path="recent" element={<RecentWorkouts />} />
          <Route path="exercise_library" element={<ExerciseLibrary />} />
          <Route path="" element={<Navigate to="recent" replace />} />
          <Route path="workout" element={<WorkoutForm />} />
          <Route path="workout/:workoutId/edit" element={<WorkoutForm editMode />} />
          <Route path="edit_test" element={<WorkoutForm editMode />} />
        </Route>

       </Route>
      </Route>
    </Routes>


  )
}