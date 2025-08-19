import { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useState } from "react";
import { TemplateFolder,  } from "../library/types";
import { createEmptyTemplateFolder } from "../library/factories";


interface TemplateLibararyContextValue {
  folders: TemplateFolder[];
  setFolders: Dispatch<SetStateAction<TemplateFolder[]>>;
  folder: TemplateFolder;
  setFolder: Dispatch<SetStateAction<TemplateFolder>>;
}

const TemplateLibraryContext = createContext<TemplateLibararyContextValue>({
  folders: [],
  setFolders: () => {},
  folder: {...createEmptyTemplateFolder()},
  setFolder: () => {},
})

export const TemplateLibraryProvider: FC<{ children: ReactNode }> = ({children}) => {
  const [folders, setFolders] = useState<TemplateFolder[]>([]);
  const [folder, setFolder]= useState<TemplateFolder>({...createEmptyTemplateFolder()})

  return (
    <TemplateLibraryContext.Provider value={{
      folders,
      setFolders,
      folder,
      setFolder,
    }}>
      {children}
    </TemplateLibraryContext.Provider>
  )
}

export const useTemplateLibraryContext = () => useContext(TemplateLibraryContext);