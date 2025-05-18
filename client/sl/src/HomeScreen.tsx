import { useNavigate, Outlet } from "react-router-dom";
import styles from "./styles/HomeScreen.module.css";

export default function HomeScreen() {
  const navigate = useNavigate();

  return (
    <>
      <p>Home Screen</p>
      <div className={styles.container}>
        <div className={styles.sideBar}>
          <button onClick={() => navigate("/")}>Home</button>
          <br />
          <button onClick={() => navigate("/exercise_library")}>Exercise Library</button>
          <br />
          <button onClick={() => navigate("/workout")}>Enter Workout</button>
          <br />
          <button onClick={() => navigate("/edit_test")}>Edit Workout</button>
        </div>
        <div className={styles.homeContainer}>
          <Outlet />
        </div>
      </div>
    </>
  )
}