import MyDialog from "../dialog/MyDialog"
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { ChangeEvent, useState } from "react";
import { TemplateFolder } from "../../library/types";
import { useTemplateLibraryContext } from "../../context/TemplateLibraryContext";

interface Props {
  open: boolean,
  onClose: () => {},
  originFolder: TemplateFolder,
}

export default function MoveTemplateDialog ({
  open,
  onClose,
  originFolder
}: Props) {

  const [dest, setDest] = useState<string>(originFolder.name);

  const {folders} = useTemplateLibraryContext();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDest(e.target.value);
  }

  const content = (
    <Box>
      <TextField
        select
        value={dest}
        onChange={handleChange}
        size="small"
        label
        fullWidth
      >
        {folders.map((f) => (
          <MenuItem value={f.name} key={f.name}>
            {f.name}
          </MenuItem>
        ))}
      </TextField>
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