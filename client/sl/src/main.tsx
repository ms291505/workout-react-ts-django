import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router';
import App from './App.tsx'
import "./global.css"
import { AuthProvider } from './context/AuthContext.tsx';
import { AppThemeProvider } from './context/ThemeContext.tsx';
import { WorkoutProvider } from './context/WorkoutContext.tsx';


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppThemeProvider>
          <WorkoutProvider>
            <App />
          </WorkoutProvider>
        </AppThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
