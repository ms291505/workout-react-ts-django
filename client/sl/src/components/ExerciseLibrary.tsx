import { Exercise } from "../library/types";
import { fetchExercises } from "../api";
import { Fragment, useEffect, useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { useWorkoutContext } from "../context/WorkoutContext";
import LoadingRoller from "./LoadingRoller";
import CreateExerciseModal from "./ExerciseLibrary/CreateExerciseModal";
import Typography from "@mui/material/Typography";
import ExerciseInfo from "./ExerciseLibrary/ExerciseInfo";

export default function ExerciseLibrary() {

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [createrOpen, setCreaterOpen] = useState(false);
  const {exSelections, setExSelections} = useWorkoutContext();

  useEffect(() => {
    fetchExercises().then((response) => {
      setExercises(response);
      setLoading(false);
    })
  }, []) 
  
  const filtered = useMemo(() => {
    const term = filter.toLowerCase();
    return exercises.filter((ex) =>
      (ex.name ?? "").toLowerCase().includes(term)
    );
  }, [exercises, filter])

  const handleAdd = (ex: Exercise) => {
    setExSelections((prev) =>
      prev.find((prevEx) => prevEx.id === ex.id) ? prev : [...prev, ex]
    );
  };

  const handleRemove = (ex: Exercise) => {
    const nextSelected = exSelections.filter(
      selEx => selEx.id !== ex.id
    );
    setExSelections(nextSelected);
  }

  const handleRowClick = (clickedEx: Exercise) => {
              const already = exSelections.some((ex) => ex.id === clickedEx.id);
              already ? handleRemove(clickedEx) : handleAdd(clickedEx);
            };

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          overflow:"visible",
          gap: 2,
          mb:2,
          mt: 1,
        }}
      >
        <TextField
          onChange={(event) => setFilter(event.target.value)}
          type="search"
          label="Search"
          size= "small"
          sx={{
            overflow: "visible"
          }}
        />
        <Button
          variant="contained"
          onClick={() => setCreaterOpen(true)}
        >
          Create
        </Button>
      </Box>
      <CreateExerciseModal
        open={createrOpen}
        onClose={() => {setCreaterOpen(false)}}
        newName={filter}
        onCreate={
          () => {
            fetchExercises().then((response) => {
              setExercises(response);
              setLoading(false);
            })
          }
        }
      />
      {
        loading
        ? <>
            <p>The exercise library is loading...</p>
            <LoadingRoller size={75}/>
          </>
        :
        <Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            
              justifyContent: "flex-start", // optional, but makes vertical flow clear
              minWidth: 150,
              maxHeight: 300,
              minHeight: 300,
              overflowY: "auto",
              width: "100%",      // optional: ensures horizontal space
              mt: 2,
              gap: 1
          }}
          >
            {[...filtered]
              .sort((a,b) => a.name.localeCompare(b.name))
              .map((ex) => (
                <Fragment key={ex.id}>
                  <Button
                    variant="outlined"
                    onClick={() => handleRowClick(ex)}
                    sx={{
                      width: "100%",
                      height: "auto",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      alignSelf: "stretch"
                    }}
                  >
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      sx={{
                        mb: 1
                      }}
                    >
                      {ex.name}
                    </Typography>
                    <ExerciseInfo ex={ex} />
                  </Button>

                </Fragment>
              ))
            }
          </Box>
      
        <h4>Selected Exercises:</h4>
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            sx={{
              flexWrap: "wrap",
              maxWidth: 400,
            }}
          >
            {exSelections.map((ex) => (
              <Chip
                key={ex.id}
                onDelete={() => handleRemove(ex)}
                label={ex.name}
              />
            ))}
            {
              exSelections.length > 0
              ? <Chip
                onDelete={() => setExSelections([])}
                label="Clear All"
                color="error"
                variant="outlined"
                />
              : null
            }
          </Stack>
          </Box>
        }
    </>
  )
}