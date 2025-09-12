import { AuthUser } from "@/types/type";
import { ipcRenderer, contextBridge } from "electron";

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    return ipcRenderer.on(channel, (event, ...args) =>
      listener(event, ...args)
    );
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    return ipcRenderer.off(channel, ...omit);
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    return ipcRenderer.send(channel, ...omit);
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  },
});

contextBridge.exposeInMainWorld("chatgpt", {
  ask: (prompt: string) => ipcRenderer.invoke("ask-chatgpt", prompt),
});
contextBridge.exposeInMainWorld("auth", {
  setAuthUser: (authUser: AuthUser) =>
    ipcRenderer.send("save-auth-user", authUser),
  getAuthUser: () => ipcRenderer.invoke("get-auth-user"),
});

contextBridge.exposeInMainWorld("electronAPI", {
  initializeLLM: () => ipcRenderer.invoke("run-ollama"),
});
contextBridge.exposeInMainWorld("fsmodule", {
  create: (filepath: string, code: string) =>
    ipcRenderer.invoke("create-component", filepath, code),
  pickProject: () => ipcRenderer.invoke("pick-project"),
});

contextBridge.exposeInMainWorld("updater", {
  // Trigger update check
  checkForUpdate: () => ipcRenderer.send("check_for_update"),

  // Install downloaded update
  installUpdate: () => ipcRenderer.send("install_update"),

  // Update lifecycle listeners
  onChecking: (callback: () => void) =>
    ipcRenderer.on("checking_for_update", callback),

  onUpdateAvailable: (callback: (_event: any, info: any) => void) =>
    ipcRenderer.on("update_available", callback),

  onUpdateNotAvailable: (callback: (_event: any, info: any) => void) =>
    ipcRenderer.on("update_not_available", callback),

  onUpdateDownloaded: (callback: (_event: any, info: any) => void) =>
    ipcRenderer.on("update_downloaded", callback),

  onError: (callback: (_event: any, error: any) => void) =>
    ipcRenderer.on("update_error", callback),
});
console.log("preload loaded");
