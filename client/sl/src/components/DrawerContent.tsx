import Toolbar from "@mui/material/Toolbar"
import { ReactNode } from "react"

interface Props {
  children?: ReactNode
}

export default function DrawerContent({
  children
}: Props) {



  return(
    <>
    <Toolbar variant="dense" />
    { children }
    </>
   
  )
}