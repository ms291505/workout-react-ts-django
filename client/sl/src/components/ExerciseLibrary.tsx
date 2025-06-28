import { Exercise } from "../library/types";
import { fetchExercises } from "../api";
import { useEffect, useMemo, useState } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Checkbox from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { useWorkoutContext } from "../context/WorkoutContext";
import LoadingRoller from "./LoadingRoller";
import CreateExerciseModal from "./StrengthWorkout/CreateExerciseModal";

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

  const columns: GridColDef<Exercise>[] = [
    {
      field: "add",
      headerName: "Select",
      sortable: false,
      filterable: false,
      width: 60,
      renderCell: (params: GridRenderCellParams<Exercise>) => {
        const already = exSelections.some((ex) => ex.id === params.row.id);
        return (
          <IconButton
            size="small"
            onClick={already ? () => handleRemove(params.row) : () => handleAdd(params.row)}
            sx={{
              mt:1,
              mb:1
            }}
          >
            {already ? <Checkbox /> : <CheckBoxOutlineBlankIcon />}
          </IconButton>
        )
      }
    },

    { 
      field: "name",
      headerName: "Name",
      minWidth: 200,
    },

    { field: "count180Days",
      headerName: "Last 180 Days",
      type: "string",
      width: 125,
      valueGetter: (value) => {
        if (value === 0) {
          return null;
        } else if (value === 1) {
          return value + " workout";
        } else {
          return value + " workouts";
        }
      },
    },
    
      { field: "userAddedFlag",
      headerName: "Custom",
      valueGetter: (value) => {
        if (value === "N") {
          return "";
        } else if (value === "Y") {
          return "Yes";
        } else {
          return "";
        }
      }
    },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

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
          <DataGrid
            rows={filtered}
            columns={columns}
            getRowId={(row) => row.id as string}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10, 20]}
            onRowClick={(params) => {
              const already = exSelections.some((ex) => ex.id === params.row.id);
              already ? handleRemove(params.row) : handleAdd(params.row);
            }}
            checkboxSelection={false}
            disableRowSelectionOnClick
            sx={{
              maxHeight: 800
            }}
          />
      
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