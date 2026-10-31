import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import "./styles/tokens.css" // must come after index.css
import "@fontsource-variable/jetbrains-mono"
import App from "./App"
import { StacksProvider } from "./stacks/StacksProvider"
import { ThemeProvider } from "./theme/ThemeProvider"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <StacksProvider>
        <App />
      </StacksProvider>
    </ThemeProvider>
  </StrictMode>,
)