import { Routes, Route } from 'react-router-dom';
import './App.css'
import PageHeader from './components/PageHeader';
import WorkoutForm from './WorkoutForm';
import HomeScreen from './HomeScreen';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {


  return (
    <>
      <PageHeader />
      <div>
        
      </div>
      <Routes>
        <Route
          path="/"
          element={
          <ProtectedRoute>
            <HomeScreen />
          </ProtectedRoute>
          }
        />
        <Route path="/workout" element={<WorkoutForm />} />
        <Route path="/edit_test" element={<WorkoutForm editMode />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  )
}