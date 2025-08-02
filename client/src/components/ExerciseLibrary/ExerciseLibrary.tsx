import { Exercise, Exercise_Hist, Workout_Hist } from "../../library/types";
import { fetchExercises } from "../../api";
import { useEffect, useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { useWorkoutContext } from "../../context/WorkoutContext";
import LoadingRoller from "../LoadingRoller";
import CreateExerciseModal from "./CreateExerciseModal";
import Typography from "@mui/material/Typography";
import ExerciseInfo from "./ExerciseInfo";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ExerciseDetails from "../dialog/ExerciseDetails";
import IconButton from "@mui/material/IconButton";
import { createEmptyExHist, createEmptyExSet, createEmptyWorkout } from "../../library/factories";
import { useNavigate } from "react-router";

interface Props {
  buildWorkout?: boolean;
}

export default function ExerciseLibrary({
  buildWorkout = false,
}: Props) {

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [createrOpen, setCreaterOpen] = useState(false);
  const [exDetailsOpen, setExDetailsOpen] = useState(false);
  const [exDetailSelection, setExDetailSelection] = useState<Exercise | null>(null)
  const { exSelections, setExSelections, setWorkout } = useWorkoutContext();
  const navigate = useNavigate();

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

  const handleMoreClick = (clickedEx: Exercise) => {
    setExDetailSelection(clickedEx);
    setExDetailsOpen(true);
  }

  const handleBuildClick = () => {
    if (exSelections.length === 0) return null;
    const exercises: Exercise_Hist[] = [];
    exSelections.map((ex) => {
      const exHist: Exercise_Hist = {
        ...createEmptyExHist(),
        exerciseId: ex.id,
        name: ex.name,
        exSets: [
          createEmptyExSet(),
        ]
      }
      exercises.push(exHist);
    });
    const newWorkout: Workout_Hist = {
      ...createEmptyWorkout(),
      exercises: exercises
    };
    setWorkout(newWorkout);
    console.log(newWorkout);
    navigate("/workout/from_list");
  }

  return (
    <>

      {/* Search and select */}
      {
        loading ? (
          <>
            <p>The exercise library is loading...</p>
            <LoadingRoller size={75} />
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              alignItems: "flex-start",
              gap: 1,
              maxWidth: "100%",
            }}
          >
            {/* Search + List */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                width: "100%",
                maxWidth: "100%", // prevents overflow
              }}
            >
              {/* Search bar */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr",
                  overflow: "visible",
                  gap: 1,
                  mt: 1,
                }}
              >
                <TextField
                  onChange={(event) => setFilter(event.target.value)}
                  type="search"
                  label="Search"
                  size="small"
                  fullWidth
                />
                <Button
                  variant="contained"
                  onClick={() => setCreaterOpen(true)}
                >
                  Create
                </Button>
              </Box>

              {/* Exercise list */}
              <Box
                id="exercises-display"
                sx={{
                  mt: 1,
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "auto",
                  maxHeight: 350,
                  gap: 1,
                  width: "100%",
                  minWidth: 0, // allow it to shrink in modal
                }}
              >
                {[...filtered]
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((ex) => (
                    <Box
                      key={ex.id}
                      onClick={() => handleRowClick(ex)}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "stretch",
                        textAlign: "left",
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                        p: 1,
                        gap: 1,
                        backgroundColor: "background.paper",
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "action.hover",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <Typography variant="body2" fontWeight="bold">
                          {ex.name}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoreClick(ex);
                          }}
                        >
                          <MoreHorizIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <ExerciseInfo ex={ex} />
                    </Box>
                  ))}
              </Box>
            </Box>

            {/* Selected Exercises */}
            <Box
              sx={{
                width: {
                  xs: "100%",
                  sm: 220,
                },
                flexShrink: 0,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                p: 1,
                backgroundColor: "background.paper",
                mt: {
                  sm: 1
                },
                minHeight: {
                  sm: 400
                }
              }}
            >
              <Typography variant="body2" sx={{ mb: 1 }}>
                Selected Exercises:
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                useFlexGap
                sx={{
                  flexWrap: "wrap",
                  maxWidth: "100%",
                }}
              >
                {exSelections.map((ex) => (
                  <Chip
                    key={ex.id}
                    onDelete={() => handleRemove(ex)}
                    label={ex.name}
                  />
                ))}
                {exSelections.length > 0 && (
                  <Chip
                    onDelete={() => setExSelections([])}
                    label="Clear All"
                    color="error"
                    variant="outlined"
                  />
                )}
              </Stack>
            </Box>
          </Box>
        )
      }

      {buildWorkout &&
        <Button
          variant="contained"
          onClick={handleBuildClick}
        >
          Build Workout
        </Button>

      }

      {/* Dialogs */}
      <ExerciseDetails
        open={exDetailsOpen}
        onClose={() => setExDetailsOpen(false)}
        ex={exDetailSelection}
      />
      <CreateExerciseModal
        open={createrOpen}
        onClose={() => setCreaterOpen(false)}
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
    </>
  )
}
