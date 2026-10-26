import { useState } from "react"

import type { ViewId } from "@/app/navigation"
import { AppShell } from "@/components/AppShell"

function App() {
  const [active, setActive] = useState<ViewId>("overview")

  return <AppShell active={active} onSelect={setActive} />
}

export default App