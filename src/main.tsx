import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "./styles/tokens.css" 
import "@fontsource-variable/jetbrains-mono"
import App from './App.tsx'
import { ThemeProvider } from "./theme/ThemeProvider"
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
