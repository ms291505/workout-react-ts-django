import roller from "../assets/Roller.svg";
import Box from "@mui/material/Box";

interface Props {
  size: number,
}

/**
 * 
 * @param size - number for width and height style override.
 */
export default function LoadingRoller({
  size
}: Props) {

  return(
    <Box
      component="img"
      src={roller}
      alt="Loading..."
      sx={{
        width: size,
        height: size
      }}
    />
  )
}