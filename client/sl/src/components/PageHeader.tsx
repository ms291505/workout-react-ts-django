import { logout } from "../api";
import { useNavigate } from "react-router";

export default function PageHeader() {
  const navigate = useNavigate();

  const title1 = "The Log";

  async function handleLogout() {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (err) {
      console.error(err)
    }
  }
  
  return (
    <>
      <h1>{title1}</h1>
      <button type="button" onClick={ handleLogout }>Log Out</button>
    </>
  )
}