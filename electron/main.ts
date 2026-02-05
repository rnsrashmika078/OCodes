import { app, BrowserWindow, ipcMain } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { autoUpdater } from "electron-updater";
import path from "node:path";
import dotenv from "dotenv";
import { UserPreference } from "./storage";
import { exec } from "node:child_process";
import { registerFileSystemHandlers } from "./ipcs";
import { OpenAI } from "openai";
import { Groq } from "groq-sdk";
import { handleFileOperations } from "./ipcs/fileOperations";
// const groq = new Groq();

// import pty from "@homebridge/node-pty-prebuilt-multiarch";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import "./terminal/terminal"; // ← THIS IS THE MAGIC LINE
// import {
//   registerTermial,
//   setMainWindow,
//   setTerminalWindow,
// } from "./terminal/terminal";

// terminal paths
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

ipcMain.handle("run-ollama", async () => {
  return new Promise((resolve, reject) => {
    exec(
      "C:\\Users\\Rashm\\OneDrive\\Desktop\\initLLM.bat",
      (err, stdout, _stderr) => {
        if (err) return reject(err.message);
        resolve(stdout || "Script executed.");
      }
    );
  });
});

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
  // createWindow();
  UserPreference();
  // registerFileSystemHandlers(win);
  handleFileOperations(win);
  autoUpdater.checkForUpdatesAndNotify();
});
