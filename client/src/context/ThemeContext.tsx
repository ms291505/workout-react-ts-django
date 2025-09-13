import { createContext, useState, ReactNode, FC, useContext, SetStateAction, Dispatch } from "react";
import { createTheme, Theme, useMediaQuery } from "@mui/material";
import { cyan,  deepPurple, amber } from '@mui/material/colors';

interface AppThemeContextValue {
  darkMode: boolean;
  theme: Theme;
  toggleDarkMode: () => void;
  isMobile: boolean;
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
}

const AppThemeContext = createContext<AppThemeContextValue>({
  darkMode: false,
  theme: createTheme(),
  toggleDarkMode: () => {},
  isMobile: false,
  title: "",
  setTitle: () => {},
});

export const AppThemeProvider: FC<{ children: ReactNode }> = ({children}) => {

  const [title, setTitle] = useState("");
  
  const [darkMode, setDarkMode] = useState(
    useMediaQuery("(prefers-color-scheme: dark)")
  );

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      return newMode;
    })
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: darkMode? cyan : deepPurple,
      secondary: darkMode ? cyan : amber,
      background: darkMode
        ? {
            default: "#2a2a2a",
            paper: "#333"
          }
        : {
            default: "#f4f3ef",
            paper: "#efeee8"
        },
    },
  });

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <AppThemeContext.Provider value={{
      darkMode,
      theme,
      toggleDarkMode,
      isMobile,
      title,
      setTitle
    }}>
      {children}
    </AppThemeContext.Provider>
  );
};

export const useAppThemeContext = () => useContext(AppThemeContext);