import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import Toolbar from "@mui/material/Toolbar"
import { useNavigate } from "react-router";

export default function DrawerContent() {

  const navigate = useNavigate();

  return(
    <>
    <Toolbar variant="dense" />
    <List>
      <ListItemButton
        onClick={() => navigate("/")}
      >
        Home
      </ListItemButton>
      <ListItemButton
        onClick={() => navigate("/workout")}
      >
        Enter Workout
      </ListItemButton>
      <ListItemButton
        onClick={() => navigate("/exercise_library")}
      >
        Exercise Library
      </ListItemButton>
    </List>
    </>
   
  )
}