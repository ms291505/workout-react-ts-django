import { createContext, useState, ReactNode, FC, useContext } from "react";
import { createTheme, Theme, useMediaQuery } from "@mui/material";
import { cyan, yellow } from '@mui/material/colors';

interface AppThemeContextValue {
  darkMode: boolean;
  theme: Theme;
  toggleDarkMode: () => void;
  isMobile: boolean;
}

const AppThemeContext = createContext<AppThemeContextValue>({
  darkMode: false,
  theme: createTheme(),
  toggleDarkMode: () => {},
  isMobile: false,
});

export const AppThemeProvider: FC<{ children: ReactNode }> = ({children}) => {
  
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
      primary: cyan,
      secondary: darkMode ? cyan : yellow,
      background: darkMode
        ? {
            default: "#2a2a2a",
            paper: "#333"
          }
        : {
            default: "#fff2da",
            paper: "#fdf8ed"
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
    }}>
      {children}
    </AppThemeContext.Provider>
  );
};

export const useAppThemeContext = () => useContext(AppThemeContext);