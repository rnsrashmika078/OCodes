"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(
      channel,
      (event, ...args2) => listener(event, ...args2)
    );
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
});
electron.contextBridge.exposeInMainWorld("chatgpt", {
  ask: (prompt) => electron.ipcRenderer.invoke("ask-chatgpt", prompt)
});
electron.contextBridge.exposeInMainWorld("auth", {
  setAuthUser: (authUser) => electron.ipcRenderer.send("save-auth-user", authUser),
  getAuthUser: () => electron.ipcRenderer.invoke("get-auth-user")
});
electron.contextBridge.exposeInMainWorld("electronAPI", {
  initializeLLM: () => electron.ipcRenderer.invoke("run-ollama")
});
electron.contextBridge.exposeInMainWorld("fsmodule", {
  create: (filepath, code) => electron.ipcRenderer.invoke("create-component", filepath, code),
  pickProject: () => electron.ipcRenderer.invoke("pick-project"),
  openFile: (filePath) => electron.ipcRenderer.invoke("read-file", filePath)
});
electron.contextBridge.exposeInMainWorld("updater", {
  // Trigger update check
  checkForUpdate: () => electron.ipcRenderer.send("check_for_update"),
  // Install downloaded update
  installUpdate: () => electron.ipcRenderer.send("install_update"),
  // Update lifecycle listeners
  onChecking: (callback) => electron.ipcRenderer.on("checking_for_update", callback),
  onUpdateAvailable: (callback) => electron.ipcRenderer.on("update_available", callback),
  onUpdateNotAvailable: (callback) => electron.ipcRenderer.on("update_not_available", callback),
  onUpdateDownloaded: (callback) => electron.ipcRenderer.on("update_downloaded", callback),
  onError: (callback) => electron.ipcRenderer.on("update_error", callback)
});
console.log("preload loaded");
