import React from "react";
import { Provider as StyletronProvider, DebugEngine } from "styletron-react";
import { Client as Styletron } from "styletron-engine-atomic";
import { StyleReset } from "atomize";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

const debug =
  process.env.NODE_ENV === "production" ? void 0 : new DebugEngine();

const engine = new Styletron();

function App() {
  return (
    <>
      <StyletronProvider value={engine} debug={debug} debugAfterHydration>
        <StyleReset />
        <BrowserRouter>
          <Routes>
            <Route index element={<Home />} />
          </Routes>
        </BrowserRouter>
      </StyletronProvider>
    </>
  );
}

export default App;
