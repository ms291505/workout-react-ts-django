import { Routes, Route } from 'react-router-dom';
import { createElement } from 'react'
import './App.css'
import WorkoutForm from './WorkoutForm';
import HomeScreen from './HomeScreen';

function App() {

  const title1 = "The Log";
  const pageHeader = createElement(
    "h1",
    {id: "pageHeader"},
    title1
  );

  return (
    <>
      { pageHeader }
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/workout" element={<WorkoutForm />} />
        <Route path="/edit_test" element={<WorkoutForm editMode={true} />} />
      </Routes>
    </>
  )
}

export default App;
