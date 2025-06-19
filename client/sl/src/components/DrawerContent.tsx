import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import Toolbar from "@mui/material/Toolbar"
import { useNavigate } from "react-router";

interface Props {
  onClose?: () => void;
}

export default function DrawerContent({
  onClose
}: Props) {

  const navigate = useNavigate();

  const handleNavClick = (targetPath: string) => {
    navigate(targetPath);
    onClose?.();
  }

  return(
    <>
    <Toolbar variant="dense" />
    <List>
      <ListItemButton
        onClick={() => handleNavClick("/")}
      >
        Home
      </ListItemButton>
      <ListItemButton
        onClick={() => handleNavClick("/workout/new")}
      >
        Enter Workout
      </ListItemButton>
      <ListItemButton
        onClick={() => handleNavClick("/exercise_library")}
      >
        Exercise Library
      </ListItemButton>
    </List>
    </>
   
  )
}