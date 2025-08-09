import Box from "@mui/material/Box";
import { MenuAction, TemplateFolder, TmplWorkoutHist } from "../../library/types";
import { useEffect, useState } from "react";
import { deleteTemplate, deleteTemplateFolder, fetchTemplateFolders, fetchTmplWorkoutHists, postTemplateFolder } from "../../api";
import LoadingRoller from "../LoadingRoller";
import Divider from "@mui/material/Divider";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ConfirmDialog from "../dialog/ConfirmDialog";
import { enqueueSnackbar } from "notistack";
import MyDialog from "../dialog/MyDialog";
import TextField from "@mui/material/TextField";
import { CENTER_COL_FLEX_BOX } from "../../styles/StyleOverrides";
import { handleControlledChange } from "../../utils";
import { createEmptyTemplateFolder } from "../../library/factories";
import FolderHeader from "./FolderHeader";

interface Loading {
  templates: boolean;
  folders: boolean;
}

export default function TemplatesLibrary() {

  const [templates, setTemplates] = useState<TmplWorkoutHist[]>([]);
  const [loading, setLoading] = useState<Loading>({
    templates: true,
    folders: true
  });
  const [folders, setFolders] = useState<TemplateFolder[]>([]);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [selection, setSelection] = useState<TmplWorkoutHist| null>(null);
  const [folderCreateOpen, setFolderCreateOpen] = useState(false);
  const [newFolder, setNewFolder] = useState<TemplateFolder>({...createEmptyTemplateFolder()})

  const folderMenuActions: MenuAction[] = [
    {
      label: "Delete",
      action: (f: TemplateFolder) => handleDeleteFolder(f)
      //TODO: Add delete folder API.
    }
  ]
  
  useEffect(() => {
    Promise.all([fetchTmplWorkoutHists(), fetchTemplateFolders()])
      .then(([templateResponse, folderResponse]) => {
        setTemplates(templateResponse);
        setFolders(folderResponse);
        console.log(folderResponse);
        setLoading({ templates: false, folders: false });
      });
    
      setRefreshTrigger(false);
  }, [refreshTrigger]);

  const folderedIds = new Set(
    folders.flatMap(folder => folder.templates)
  );

  const grouped = folders.map(folder => ({
    id: folder.id,
    name: folder.name || "Unamed Folder",
    templates: templates.filter(template => folder.templates.includes(template.id!))
  }));

  const uncategorized = templates.filter(template => !folderedIds.has(template.id!));
  if (uncategorized.length > 0) {
    grouped.push({
      id: -1,
      name: "Uncategorized",
      templates: uncategorized,
    });
  }

  const handleDeleteFolder = async (folder: TemplateFolder) => {
    if (!folder) return null;
    try {
      const response = await deleteTemplateFolder(folder.id);
      if (response) {
        enqueueSnackbar(`'${folder.name}' was deleted.`);
        setRefreshTrigger(true);
      }
    } catch (err) {
      console.error("An error occured while trying to delete.", err);
    }
  }

  const handleDeleteTemplate = async (template: TmplWorkoutHist | null) => {
    if (!template) return null;
    try {
      const response = await deleteTemplate(template);
      if (response === true) {
        enqueueSnackbar(`'${template.name}' was deleted.`);
        setRefreshTrigger(true);
      }
      
    } catch (err) {
      console.error("An error occured while trying to delete.", err);
      if (err && typeof err === "object" && "name" in err) {
        const nameErrors = (err as any).name;
        const message = Array.isArray(nameErrors) ? nameErrors[0] : "An unkown Exercise Name error.";
        enqueueSnackbar(message, { variant: "error" });
      }
    } finally {
      setConfirmDeleteOpen(false);
    }
  }

  const handleAddFolder = () => {
    setLoading(prev => ({...prev, folders: true}))
    try {
      postTemplateFolder(newFolder);
      console.log(newFolder);
      const newFolders: TemplateFolder[] = structuredClone(folders);
      newFolders.push(newFolder);
      setFolders(newFolders);
      setNewFolder({...createEmptyTemplateFolder()});
    } catch(err) {
      console.log(err);
    } finally {
      setFolderCreateOpen(false);
      setLoading(prev => ({...prev, folders: false}))
    }
  }


  if (Object.values(loading).some(Boolean)) return (
    <>
      <p>The template library is loading...</p>
      <LoadingRoller size={75} />
    </>
  )
  return (
    <>
    <Box
      sx={{
        display:"flex",
        direction:"row",
        gap: 2,
        m: 1,
        mb: 2
      }}
    >
      <Button
        variant="contained"
        onClick={() => setFolderCreateOpen(true)}
      >
        Add Folder
      </Button>
      <Button
        variant="contained"
      >
        Add Template
      </Button>
    </Box>
    <Box>
      {grouped.map(folder => (
        <Box key={folder.id}>
          <FolderHeader folder={folder} actions={folderMenuActions} />
          <Divider sx={{mb: 2}}/>
          <Grid container spacing={2}>

          {folder.templates.map(template => (
              <Grid key={template.id} size= {{xs: 12, sm: 6, md: 4}}>
                <Card raised>
                  <CardContent>
                    <Typography
                      variant="h6"
                    >
                      {template.name}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      onClick={() => {
                        setConfirmDeleteOpen(true);
                        setSelection(template);
                      }}
                      variant="outlined"
                      color="error"
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid> 
            )
          )

          }
          </Grid>
          <Box>

          </Box>
        </ Box>
      ))}
    </Box >
    
    <ConfirmDialog
      onConfirm={() => handleDeleteTemplate(selection)}
      open={confirmDeleteOpen}
      onClose={() => setConfirmDeleteOpen(false)}
      title="Are you sure?"
      confirmText="Delete"
      confirmType="delete"
    />
    <MyDialog
      open={folderCreateOpen}
      onClose= {() => setFolderCreateOpen(false)}
      title= "Create Folder"
      content={
        <Box
          sx={{
            ...CENTER_COL_FLEX_BOX,
          }}
        >
          <Box
            sx={{ display: "flex", width: "100%"}}
          >

          <TextField
            label="Folder Name"
            name="name"
            size="small"
            sx={{flex:1, m:1, mb: 2}}
            value={newFolder.name}
            onChange={(event) => handleControlledChange(event, setNewFolder)}
          />
          </Box>
          <Box
            sx={{
            display: "flex",
            direction: "row",
            gap: 1,
            width: "100%"
            }}
          >
            <Button
              variant="outlined"
              color="error"
              sx={{flex: 1}}
              onClick={() => setFolderCreateOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{flex: 1}}
              onClick={handleAddFolder}
            >
              Save
            </Button>
          </Box>
        </Box>
      }
    />
    </>
  )
}
