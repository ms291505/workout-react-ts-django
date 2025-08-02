import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { SxProps } from "@mui/material";

interface Props {
  label: string;
  value: string;
  sx?: SxProps;
}

export default function ExerciseAttribute ({
  label,
  value = "",
  sx
}: Props) {
  return(
    <Box
      display="flex"
      flexDirection="column"
      sx={sx}
    >
      <Typography
        variant="caption" color="text.secondary"
      >
        {label}
      </Typography>
      <Typography
        variant="caption" color="text.secondary"
      >
        {value}
      </Typography>
    </Box>
  )
}