import MyDialog from "../dialog/MyDialog"
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { ChangeEvent, useState } from "react";
import { TemplateFolder, TmplWorkoutHist } from "../../library/types";
import { useTemplateLibraryContext } from "../../context/TemplateLibraryContext";
import { updateTemplateFolder } from "../../api";
import { enqueueSnackbar } from "notistack";
import { CENTER_COL_FLEX_BOX } from "../../styles/StyleOverrides";

interface Disable {
  save: boolean,
  cancel: boolean
}

interface Props {
  open: boolean,
  onClose: () => void,
  originFolder: TemplateFolder | null,
}

export default function MoveTemplateDialog ({
  open,
  onClose,
  originFolder
}: Props) {

  if (!originFolder) return;

  const [destId, setDestId] = useState<string>(String(originFolder.id));
  const [disable, setDisable] = useState<Disable>({
    save: true,
    cancel: false
  })

  const disableAllBoolean = (b: boolean) => ({
    save: b,
    cancel: b,
  });

  const {
    folders,
    selection,
    setRefreshTrigger,
  } = useTemplateLibraryContext();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDestId(e.target.value);
    if (destId !== originFolder.id) {
      setDisable(prev => ({
        ...prev,
        save: false
      }))
    }
  }

  const handleMoveTemplate = async (
    t: TmplWorkoutHist,
    destFolderId: string,
  ) => {
    const destFolder = folders.find(f => String(f.id) === destFolderId)
    if (!destFolder) return;
    setDisable(disableAllBoolean(true));
    
    if (!t.id) {
      console.error("Tried to move a template, but it doesn't have an id: ", t);
      setDisable(disableAllBoolean(false));
      return;
    }

    const newDestFolder = structuredClone(destFolder);
    newDestFolder.templates.push(t.id);

    const newOrigFolder: TemplateFolder = {
      id: originFolder.id,
      name: originFolder.name,
      templates: originFolder.templates.filter(tmpl => String(tmpl) !== String(t.id)),
      };

    try {
      const orig = await updateTemplateFolder(newOrigFolder);
      const dest = await updateTemplateFolder(newDestFolder);
      enqueueSnackbar(
        `Moved from '${dest.name}' to '${orig.name}'.`
      );
      setRefreshTrigger(true);
      onClose();
    } catch(err) {
      console.error(
        `An error occured while updating the folder '${destFolder.name}': `,
        err
      )
      enqueueSnackbar("An error occured moving the template.", {variant: "error"})
    } finally {
      setDisable(disableAllBoolean(false));
    }

  }

  if (!selection) return null;

  return(
    <MyDialog
      open={open}
      onClose={onClose}
      title="Move Template"
      content={
        
    <Box
      sx={{
        ...CENTER_COL_FLEX_BOX,
        mt: 1
      }}
    >
      <TextField
        select
        value={destId}
        onChange={handleChange}
        size="small"
        label="Folder"
        fullWidth
      >
        {folders.map((f) => (
          <MenuItem value={String(f.id)} key={f.id}>
            {f.name}
          </MenuItem>
        ))}
      </TextField>
      <Box>
        <Button
          variant="outlined"
          disabled={disable.cancel}
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={disable.save}
          onClick={() => handleMoveTemplate(selection, destId)}
        >
          Save
        </Button>
      </Box>
    </Box>
      }
    />
  )
}