import React from "react";
import ReactDOM from "react-dom/client";
import { installCortexUIRuntime } from "@cortexui/runtime";
import { App } from "./App";
import "../styles/theme.css";

const runtime = installCortexUIRuntime(window);

if (runtime) {
  window.__CORTEX_UI__ = runtime;
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
