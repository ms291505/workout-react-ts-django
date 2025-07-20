
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Checkbox from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

interface Props {
  flagged: boolean;
  handleClick: () => void;
  sx?: {};
}

export default function TemplateMenu({
  flagged,
  handleClick,
  sx
}: Props) {

  return (
    <Box
      sx={{
        display: "flex",
        direction:"row",
        alignItems: "center",
        justifyItems: "flex-start",
        ...sx
      }}
    >
      <IconButton
        onClick={handleClick}
      >
        { flagged
          ? <Checkbox />
          : <CheckBoxOutlineBlankIcon />
        }
      </IconButton>
      <Typography>
        Create template from workout?
      </Typography>
    </Box>
  )
}