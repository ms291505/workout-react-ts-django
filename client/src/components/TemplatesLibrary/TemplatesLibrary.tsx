import Box from "@mui/material/Box";
import { TmplWorkoutHist } from "../../library/types";
import { useEffect, useState } from "react";
import { fetchTmplWorkoutHists } from "../../api";
import LoadingRoller from "../LoadingRoller";

export default function TemplatesLibrary() {

  const [templates, setTemplates] = useState<TmplWorkoutHist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTmplWorkoutHists().then((response) => {
      setTemplates(response);
      setLoading(false);
    })
  }, [])


  if (loading) return (
    <>
      <p>The template library is loading...</p>
      <LoadingRoller size={75} />
    </>
  )
  return (
    <Box>

    </Box >
  )
}
