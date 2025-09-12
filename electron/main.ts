import { app, BrowserWindow, ipcMain } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { autoUpdater } from "electron-updater";
import path from "node:path";
import dotenv from "dotenv";
import { UserPreference } from "./storage";
import { exec } from "node:child_process";
import { writeFileSync } from "fs";
import { join } from "path";
import { registerFileSystemHandlers } from "./ipcs";

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

  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadURL(`file://${path.join(RENDERER_DIST, "index.html")}`);
  }

  // ✅ AutoUpdater events
  autoUpdater.on("checking-for-update", () => {
    console.log("Checking for update...");
    win?.webContents.send("checking_for_update");
  });

  autoUpdater.on("update-available", (info) => {
    console.log("Update available!", info);
    win?.webContents.send("update_available", info);
  });

  autoUpdater.on("update-not-available", (info) => {
    console.log("No updates available.");
    win?.webContents.send("update_not_available", info);
  });

  autoUpdater.on("error", (err) => {
    console.error("Update failed:", err);
    win?.webContents.send(
      "update_error",
      err == null ? "unknown" : err.message || err
    );
  });

  autoUpdater.on("update-downloaded", (info) => {
    console.log("Update downloaded. Ready to install.");
    win?.webContents.send("update_downloaded", info);
  });
}

UserPreference();

ipcMain.handle("ask-chatgpt", async (_event, prompt) => {
  try {
    // const res = await fetch(
    //   `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    //   {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    //   }
    // );
    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2:latest",
        prompt: prompt,
        stream: false, // no streaming
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        error: true,
        status: res.status,
        message: errorData?.error?.message || "Request failed",
      };
    }

    const text = data.response;
    return { error: false, message: text || "No reply received" };
  } catch (error) {
    return {
      error: true,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
});

//ipc function for run the llm

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
  createWindow();
  registerFileSystemHandlers();
  autoUpdater.checkForUpdatesAndNotify();
});
