
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Checkbox from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import TextField from "@mui/material/TextField";
import Collapse from "@mui/material/Collapse";
import Fade from "@mui/material/Fade";
import { ChangeEvent } from "react";
import { useWorkoutContext } from "../../context/WorkoutContext";

interface Props {
  flagged: boolean;
  handleClick: () => void;
  sx?: {};
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  value?: any;
}

export default function TemplateMenu({
  flagged,
  handleClick,
  sx,
  onChange,
  value,
}: Props) {

  const { templates } = useWorkoutContext();

  const nameConflict = templates.some(
    t => t.name!.localeCompare(String(value ?? ""), undefined, { sensitivity: "accent" }) === 0
  );

  return (
    <Box sx={{...sx}}>
      <Box
        sx={{
          display: "flex",
          direction: "row",
          alignItems: "center",
          justifyItems: "flex-start",
        }}
      >
        <IconButton
          onClick={handleClick}
        >
          {flagged
            ? <Checkbox />
            : <CheckBoxOutlineBlankIcon />
          }
        </IconButton>
        <Typography>
          Create template from workout?
        </Typography>
      </Box>
      <Collapse
        in={flagged}
        timeout={250}
        unmountOnExit
        collapsedSize={0}
      >
        <Fade in={flagged}>
          <Box
            sx={{ pl: 5 }}
          >
            <TextField
              size="small"
              value={value}
              onChange={onChange}
              label={"Tamplate Name"}
            />
            <Collapse
              in={flagged && nameConflict}
              timeout={250}
              unmountOnExit
              collapsedSize={0}
            >
              <Typography variant="body2" color="warning.main">This name matches one of your existing templates.</Typography>
            </Collapse>
          </Box>
        </Fade>
      </Collapse>

    </ Box>
  )
}
