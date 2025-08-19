import MyDialog from "../dialog/MyDialog"
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

interface Props {
  open: boolean,
  onClose: () => {}
}

export default function MoveTemplateDialog ({
  open,
  onClose,
}: Props) {

  const content = (
    <Box>
    
    </Box>
  );

  return(
    <MyDialog
      open={open}
      onClose={onClose}
      title="Move Template"
      content={content}
    />
  )
}