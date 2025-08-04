//NavList.tsx

import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import { useNavigate } from "react-router";
import { navBarRoutes } from "../library/navBarRoutes";

interface Props {
  onClose?: () => void;
}

export default function NavList({
  onClose,
}: Props) {
  const navigate = useNavigate();

  return(
    <List>
      {navBarRoutes.map(n => (
        <ListItemButton
          onClick={() => {
            navigate(n.route);
            onClose?.();
          }}
          key={n.name}
        >
          {n.name}
        </ListItemButton>
      ))

      }
    </List>
  )
}