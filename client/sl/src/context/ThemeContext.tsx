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
  const [darkMode, setDarkMode] = useState(false);

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
      secondary: yellow,
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
          }
        }
      }
    }
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