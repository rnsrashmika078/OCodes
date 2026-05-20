/* eslint-disable @typescript-eslint/no-explicit-any */
import { app, BrowserWindow, ipcMain } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { autoUpdater } from "electron-updater";
import path from "node:path";
import dotenv from "dotenv";
import { UserPreference } from "./storage";
import { ollamaQuery } from "./ipcs/llmOperation";
import "dotenv/config";
import { registerFileSystemHandlers } from "./ipcs/index.js";
import { spawn } from "child_process"; //vite

createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;

//terminal

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
    minWidth: 640,
    minHeight: 640,
    resizable: true,
    autoHideMenuBar: true,
    // frame: false,
  });
  // setMainWindow(win);
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadURL(`file://${path.join(RENDERER_DIST, "index.html")}`);
  }
}

//vite server
let devProcess: any;
ipcMain.handle("run-vite", async (_, projectPath: string) => {
  devProcess = spawn("npm", ["run", "dev", "--", "--port", "5175"], {
    cwd: projectPath,
    shell: true,
  });

  devProcess.stdout.on("data", (data: any) => {
    console.log("vite:", data.toString());
  });
  devProcess.stderr.on("data", (data: any) => {
    console.error("vite error:", data.toString());
  });
  return `http://localhost:5175`;
})
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(() => {
  // GenerateTerminalWindow();
  // startChatServer(3000);
  createWindow();
  UserPreference();
  ollamaQuery();

  registerFileSystemHandlers(win);
  // handleFileOperations(win);

  autoUpdater.checkForUpdatesAndNotify();
});
