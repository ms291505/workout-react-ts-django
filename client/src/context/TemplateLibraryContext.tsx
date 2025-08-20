import { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useState } from "react";
import { TemplateFolder, TmplWorkoutHist,  } from "../library/types";
import { createEmptyTemplateFolder } from "../library/factories";


interface TemplateLibararyContextValue {
  folders: TemplateFolder[];
  setFolders: Dispatch<SetStateAction<TemplateFolder[]>>;
  folder: TemplateFolder;
  setFolder: Dispatch<SetStateAction<TemplateFolder>>;
  selection: TmplWorkoutHist | null;
  setSelection: Dispatch<SetStateAction<TmplWorkoutHist | null>>;
}

const TemplateLibraryContext = createContext<TemplateLibararyContextValue>({
  folders: [],
  setFolders: () => {},
  folder: {...createEmptyTemplateFolder()},
  setFolder: () => {},
  selection: null,
  setSelection: () => {},
})

export const TemplateLibraryProvider: FC<{ children: ReactNode }> = ({children}) => {
  const [folders, setFolders] = useState<TemplateFolder[]>([]);
  const [folder, setFolder]= useState<TemplateFolder>({...createEmptyTemplateFolder()})
  const [selection, setSelection] = useState<TmplWorkoutHist | null>(null);

  return (
    <TemplateLibraryContext.Provider value={{
      folders,
      setFolders,
      folder,
      setFolder,
      selection,
      setSelection,
    }}>
      {children}
    </TemplateLibraryContext.Provider>
  )
}

export const useTemplateLibraryContext = () => useContext(TemplateLibraryContext);