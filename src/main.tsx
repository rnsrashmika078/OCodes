import ReactDOM from "react-dom/client";
import App from "./app.tsx";
import "./index.css";
import { GlobalContextProvider } from "./lib/context/GlobalContext.tsx";

// biome-ignore lint/style/noNonNullAssertion: <explanation>
ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <GlobalContextProvider>
    <App />
  </GlobalContextProvider>,
  // </React.StrictMode>,
);

// Use contextBridge
window.ipcRenderer.on("main-process-message", (_event, message) => {
  console.log(message);
});
