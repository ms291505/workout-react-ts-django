import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import styles from "../styles/PageHeader.module.css";

export default function PageHeader() {
  const { user, handleLogout } = useContext(AuthContext);

  const title1 = "The Log";

  
  return (
    <>
      <h1 className={styles.appTitle}>{title1}</h1>
      {user && (
        <div className={styles.userControls}>
          <span className={styles.userName}>{user?.username}</span>
          <button className={styles.logOutButton} type="button" onClick={ handleLogout }>Log Out</button>
        </div>
      )}
    </>
  )
}