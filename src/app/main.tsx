import React from "react";
import ReactDOM from "react-dom/client";
import { installDOMglyphRuntime } from "@domglyph/runtime";
import { App } from "./App";
import "../styles/theme.css";

const runtime = installDOMglyphRuntime(window);

if (runtime) {
  window.__DOMGLYPH__ = runtime;
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
