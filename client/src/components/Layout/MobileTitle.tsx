import { useAppThemeContext } from "../../context/ThemeContext";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";


export default function MobileTitle() {
  const { title, isMobile } = useAppThemeContext();

  if (!isMobile) return;

  return (
    <Box
      sx={{
        display: "flex",
        direction: "row",
        justifyContent: "center"
      }}
    >
      <Typography
        variant="h6"
      >
        { title }
      </Typography>
    </Box>
  )
}