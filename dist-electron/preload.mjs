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
  initializeLLM: () => electron.ipcRenderer.invoke("run-ollama"),
  onFsChange: (callback) => {
    const listener = (_event, data) => callback(data.event, data);
    electron.ipcRenderer.on("fs-change", listener);
    return () => {
      electron.ipcRenderer.removeListener("fs-change", listener);
    };
  }
});
electron.contextBridge.exposeInMainWorld("fsmodule", {
  createFile: (content, filepath, fileName, method) => electron.ipcRenderer.invoke("create-file", content, filepath, fileName, method),
  saveFile: (content, filepath, fileName) => electron.ipcRenderer.invoke("save-file", content, filepath, fileName),
  create: (filepath, code) => electron.ipcRenderer.invoke("create", filepath, code),
  createFolder: (parentPath, folderName) => electron.ipcRenderer.invoke("create-folder", parentPath, folderName),
  pick: () => electron.ipcRenderer.invoke("pick"),
  refreshProject: (filePath) => electron.ipcRenderer.invoke("read-project", filePath),
  openFile: (filePath) => electron.ipcRenderer.invoke("open", filePath)
});
