import { useAppThemeContext } from "../context/ThemeContext.tsx";
import { AuthProvider } from "../context/AuthContext.tsx";
import { AppThemeProvider } from "../context/ThemeContext.tsx";
import { WorkoutProvider } from "../context/WorkoutContext.tsx";
import { SnackbarProvider, closeSnackbar } from "notistack";
import { MAX_SNACK, NOTISTACK_DURATION } from "../library/constants.ts";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { ThemeProvider } from '@mui/material';
import { ReactNode } from "react";

interface Props {
  children: ReactNode
}

export default function Contexts({ children }: Props) {
  return (
    <AppThemeProvider>
      <ThemeBridge>{children}</ThemeBridge>
    </AppThemeProvider>
  );
}

function ThemeBridge({ children }: Props) {
  const { theme } = useAppThemeContext();

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        hideIconVariant
        maxSnack={MAX_SNACK}
        autoHideDuration={NOTISTACK_DURATION}
        action={(snackbarId) => (
          <IconButton
            size="small"
            onClick={() => closeSnackbar(snackbarId)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      >
        <AuthProvider>
          <WorkoutProvider>
            {children}
          </WorkoutProvider>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
