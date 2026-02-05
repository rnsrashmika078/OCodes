import { ipcMain, dialog } from "electron";
import { mkdirSync, readdirSync, statSync, watch, writeFileSync } from "fs";
import path, { basename, dirname, extname, join } from "path";
import { readFileSync } from "fs";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { BrowserWindow } from "electron/main";
//import a project or folder
export function registerFileSystemHandlers(mainWindow: BrowserWindow | null) {
  let activeWatcher: fs.FSWatcher | null = null;

  ipcMain.handle("pick", async () => {
    const result = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    });

    if (result.canceled || result.filePaths.length === 0) return null;

    const folderPath = result.filePaths[0];

    function readDirRecursive(dir: string): any {
      return readdirSync(dir).map((name) => {
        const filePath = join(dir, name);
        const stats = statSync(filePath);
        return stats.isDirectory()
          ? {
              id: uuidv4(),
              type: "folder",
              name,
              path: filePath,
              children: readDirRecursive(filePath),
            }
          : { id: uuidv4(), type: "file", name, path: filePath };
      });
    }
    if (activeWatcher) activeWatcher.close();

    // start new watcher for the project root
    activeWatcher = watchProjectDirectory(folderPath);
    return { path: folderPath, tree: readDirRecursive(folderPath) };
  });

  //open a file
  ipcMain.handle("open", async (_event, filePath: string) => {
    try {
      const content = readFileSync(filePath, "utf-8");
      return content;
    } catch (err) {
      console.error("Failed to read file:", err);
      return null;
    }
  });

  ipcMain.handle("create", async (_event, filepath: string, code?: string) => {
    try {
      // Resolve full path
      const filePath = join(filepath);

      console.log("Filepath", filepath);
      // Ensure directory exists
      const dir = dirname(filePath);
      mkdirSync(dir, { recursive: true });

      // Write AI code to file
      writeFileSync(filePath, code ?? "", "utf8");

      // Build return object with all required properties
      const result = {
        id: uuidv4(), // unique id for tracking
        content: code ?? "",
        name: basename(filePath),
        path: filePath,
        type: extname(filePath).replace(".", ""), // e.g. "tsx"
      };
      console.log("result", result);

      return { success: true, ...result };
    } catch (error) {
      console.error("❌ Error creating component:", error);
      return { success: false, error: String(error) };
    }
  });

  ipcMain.handle(
    "create-file",
    async (
      _event,
      content?: string,
      filepath?: string,
      fileName?: string,
      method?: string
    ) => {
      try {
        let filePath: string | undefined;

        if (method === "silent") {
          if (!filepath || !fileName) {
            return { success: false, error: "No path or filename provided" };
          }

          filePath = path.join(filepath, fileName);

          // Ensure directory exists
          const dir = dirname(filePath);
          mkdirSync(dir, { recursive: true });

          // Create file silently
          writeFileSync(filePath, content ?? "", "utf8");
        } else {
          // Use Save Dialog
          const result = await dialog.showSaveDialog({
            title: "Create a new file",
            defaultPath: `${fileName ?? "new-file"}.txt`,
          });

          if (result.canceled || !result.filePath) {
            return { success: false, error: "No file selected" };
          }

          filePath = result.filePath;

          const dir = dirname(filePath);
          mkdirSync(dir, { recursive: true });

          writeFileSync(filePath, content ?? "", "utf8");
        }

        return {
          success: true,
          filePath,
          id: uuidv4(),
          name: path.basename(filePath),
          type: path.extname(filePath).slice(1) || "file",
        };
      } catch (error) {
        console.error("Error creating file:", error);
        return {
          success: false,
          error: String(error),
          filePath: null,
          name: null,
          type: null,
        };
      }
    }
  );

  ipcMain.handle(
    "save-file",
    async (_event, content?: string, filepath?: string, fileName?: string) => {
      try {
        if (!filepath || !fileName) {
          return { success: false, error: "No path or filename provided" };
        }
        const filePath = path.join(filepath);
        writeFileSync(filePath, content ?? "", "utf8");

        console.log("Saving file is done");
        return {
          success: true,
          filePath,
          id: uuidv4(),
          name: path.basename(filePath),
          type: path.extname(filePath).slice(1) || "file",
        };
      } catch (error) {
        console.error("Error saving file:", error);
        return {
          success: false,
          error: String(error),
          filePath: null,
          name: null,
          type: null,
        };
      }
    }
  );

  ipcMain.handle("create-folder", async (_event, folderPath: string) => {
    try {
      if (!folderPath) {
        return { success: false, error: "No folder path provided" };
      }

      mkdirSync(folderPath, { recursive: true });

      return {
        success: true,
        folderPath,
        id: uuidv4(),
        name: path.basename(folderPath),
        type: "folder",
      };
    } catch (error) {
      console.error("Error creating folder:", error);
      return {
        success: false,
        error: String(error),
        folderPath: null,
        name: null,
        type: null,
      };
    }
  });
  ipcMain.handle("read-project", async (_event, folderPath: string) => {
    if (!folderPath) {
      throw new Error("No folder path provided to read-project");
    }
    function readDirRecursive(dir: string): any {
      return readdirSync(dir).map((name) => {
        const filePath = join(dir, name);
        const stats = statSync(filePath);
        return stats.isDirectory()
          ? {
              id: uuidv4(),
              type: "folder",
              name,
              path: filePath,
              children: readDirRecursive(filePath),
            }
          : { id: uuidv4(), type: "file", name, path: filePath };
      });
    }

    return { path: folderPath, tree: readDirRecursive(folderPath) };
  });
  // Watch project folder for changes
  function watchProjectDirectory(folderPath: string) {
    const watcher = watch(
      folderPath,
      { recursive: true },
      (event, filename) => {
        if (!filename) return;

        const fullPath = path.join(folderPath, filename);
        // send update to renderer
        mainWindow &&
          mainWindow.webContents.send("fs-change", {
            event,
            filename,
            fullPath,
          });
      }
    );

    watcher.on("error", (err) => {
      console.error("❌ FS watcher error:", err);
    });

    return watcher;
  }
}
