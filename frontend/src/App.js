import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar"
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Workers from "./scenes/workers/workers";
import Topologies from "./scenes/topologies/topologies";
import Deployments from "./scenes/deployments/deployments";
import Generator from "./scenes/generator/generator";
import Cenario from "./scenes/cenario/cenario";



function App() {
  const [theme, colorMode] = useMode();

  return (
  <ColorModeContext.Provider value={colorMode}>
    <ThemeProvider theme={theme}>
      <CssBaseline/>
        <div className="app">
          <Sidebar />
          <main className="content">
            <Topbar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/workers" element={<Workers />} />
              <Route path="/topologies" element={<Topologies />} />
              <Route path="/deployments" element={<Deployments />} />
              <Route path="/generator" element={<Generator />} />
              <Route path="/cenario" element={<Cenario />} />


            </Routes>
          </main>
        </div>
    </ThemeProvider>
  </ColorModeContext.Provider>

  );
 
}

export default App;
