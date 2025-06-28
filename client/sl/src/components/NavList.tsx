//NavList.tsx

import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import { useNavigate } from "react-router";

interface Props {
  onClose?: () => void;
}

export default function NavList({
  onClose,
}: Props) {
  const navigate = useNavigate();
  const handleNavClick = (targetPath: string) => {
    navigate(targetPath);
    onClose?.();
  }

  return(
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
  )
}