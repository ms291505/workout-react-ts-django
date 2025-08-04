import Box from "@mui/material/Box";
import { TemplateFolder, TmplWorkoutHist } from "../../library/types";
import { useEffect, useState } from "react";
import { deleteTemplate, fetchTemplateFolders, fetchTmplWorkoutHists } from "../../api";
import LoadingRoller from "../LoadingRoller";
import Divider from "@mui/material/Divider";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FolderIcon from '@mui/icons-material/Folder';
import ConfirmDialog from "../dialog/ConfirmDialog";
import { enqueueSnackbar } from "notistack";

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

  useEffect(() => {
    Promise.all([fetchTmplWorkoutHists(), fetchTemplateFolders()])
      .then(([templateResponse, folderResponse]) => {
        setTemplates(templateResponse);
        setFolders(folderResponse);
        setLoading({ templates: false, folders: false });
      });
    
      setRefreshTrigger(false);
  }, [refreshTrigger]);

  const folderedIds = new Set(
    folders.flatMap(folder => folder.templateIdsArray)
  );

  const grouped = folders.map(folder => ({
    name: folder.name || "Unamed Folder",
    templates: templates.filter(template => folder.templateIdsArray.includes(template.id!))
  }));

  const uncategorized = templates.filter(template => !folderedIds.has(template.id!));
  if (uncategorized.length > 0) {
    grouped.push({
      name: "Uncategorized",
      templates: uncategorized,
    });
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
      console.error("Ann error occured while trying to delete.", err);
      if (err && typeof err === "object" && "name" in err) {
        const nameErrors = (err as any).name;
        const message = Array.isArray(nameErrors) ? nameErrors[0] : "An unkown Exercise Name error.";
        enqueueSnackbar(message, { variant: "error" });
      }
    } finally {
      setConfirmDeleteOpen(false);
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
    <Box>
      {grouped.map(folder => (
        <Box key={folder.name}>
          <Box
            sx={{
              display: "flex",
            }}
          >
            <FolderIcon sx={{pb: 0.5, mr: 1}} />
            <Typography>

            {folder.name}
            </Typography>
          </Box>
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
    </>
  )
}
