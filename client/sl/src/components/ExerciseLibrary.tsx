import { Exercise } from "../library/types";
import { fetchExercises } from "../api";
import { useEffect, useMemo, useState } from "react";
import styles from "../styles/ExerciseLibrary.module.css";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

export default function ExerciseLibrary() {

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [selected, setSelected] = useState<Exercise[]>([]);

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
    setSelected((prev) =>
      prev.find((prevEx) => prevEx.id === ex.id) ? prev : [...prev, ex]
    );
  };

  const handleRemove = (ex: Exercise) => {
    const nextSelected = selected.filter(
      selEx => selEx.id !== ex.id
    );
    setSelected(nextSelected);
  }

  const columns: GridColDef<Exercise>[] = [
    {
      field: "add",
      headerName: "Action",
      sortable: false,
      filterable: false,
      width: 120,
      renderCell: (params: GridRenderCellParams<Exercise>) => {
        const already = selected.some((ex) => ex.id === params.row.id);
        return (
          <Button
            size="small"
            variant={already ? "outlined" : "contained"}
            disabled={already}
            onClick={() => handleAdd(params.row)}
          >
            {already ? "Added" : "Add"}
          </Button>
        )
      }
    },
    { field: "name", headerName: "Name", width: 250 },

    /* Add a getter to replace null values with N, or change to Yes/No */
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

    { field: "count180Days",
      headerName: "Count in Last 180 Days",
      type: "number",
      width: 180,
      valueGetter: (value) => {
        if (value === 0) {
          return null;
        } else {
          return value;
        }
      },
      },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <div className={styles.container}>
      <div>
        <TextField
          onChange={(event) => setFilter(event.target.value)}
          type="search"
          label="Search"
          sx={{ mb: 2 }}
        />
      </div>
      {
        loading
        ? "The library is loading..."
        : <DataGrid
            rows={filtered}
            columns={columns}
            getRowId={(row) => row.id as string}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10, 20]}
            sx={{
              maxHeight: 800
            }}
          />
      }
      <div>
        <h3>Chosen Exercises:</h3>
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            sx={{
              flexWrap: "wrap"
            }}
          >
            {selected.map((ex) => (
              <Chip
                key={ex.id}
                onDelete={() => handleRemove(ex)}
                label={ex.name}
              />
              ))}
          </Stack>
      </div>
    </div>
  )
}