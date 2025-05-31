import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router';
import App from './App.tsx'
import "./global.css"
import { AuthProvider } from './context/AuthContext.tsx';
import { AppThemeProvider } from './context/ThemeContext.tsx';


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppThemeProvider>
          <App />
        </AppThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
