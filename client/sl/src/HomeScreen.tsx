import { useNavigate } from "react-router-dom";

export default function HomeScreen() {
  const navigate = useNavigate();

  return (
    <>
      <p>Home Screen</p>
      <button onClick={() => navigate("/workout")}>Enter Workout</button>
      <button onClick={() => navigate("/edit_test")}>Edit Workout</button>
    </>
  )
}