import { watch } from "fs";
import path from "path";
import { BrowserWindow } from "electron";

export function watchProjectDirectory(
  folderPath: string,
  mainWindow: BrowserWindow
) {
  const watcher = watch(folderPath, { recursive: true }, (event, filename) => {
    if (!filename) return; // sometimes null

    const fullPath = path.join(folderPath, filename);

    // send update to renderer
    mainWindow.webContents.send("fs-change", {
      event,
      filename,
      fullPath,
    });
  });

  watcher.on("error", (err) => {
    console.error("❌ FS watcher error:", err);
  });

  return watcher;
}
