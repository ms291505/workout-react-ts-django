import { TemplateFolder, MenuAction } from "../../library/types"
import Box from "@mui/material/Box";
import FolderIcon from '@mui/icons-material/Folder';
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState, MouseEvent } from "react";

interface Props {
  folder: TemplateFolder;
  actions?: MenuAction[];
}

export default function FolderHeader ({
  folder,
  actions,
}: Props) {

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const handleMenuClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }

  return(
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center"
        }}
      >
        <FolderIcon sx={{pb: 0.5, mr: 1}} />
        <Typography
          sx={{
            mr: 1
          }}
        >
        {folder.name}
        </Typography>
        { (folder.name === "Uncategorized")
          ? null
          : <IconButton
              size="small"
              sx={{
                p: 0.5
              }}
              onClick={handleMenuClick}
            >
              <MoreHorizIcon /> 
            </IconButton>
        }
        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left"
          }}
        >
          {actions && actions.map((action) => (
            <MenuItem
              onClick={() => {
                action.action(folder);
                setAnchorEl(null);
              }}
              key={action.label}
            >{action.label}</MenuItem>
          ))}
        </Menu>
      </Box>
    </>
  )
}