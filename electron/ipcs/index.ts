import { ipcMain, dialog } from "electron";
import { mkdirSync, readdirSync, statSync, writeFileSync } from "fs";
import path, { dirname, join } from "path";
import { readFileSync } from "fs";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

//import a project or folder
export function registerFileSystemHandlers() {
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
    console.log("📂 File path:", folderPath);

    return { path: folderPath, tree: readDirRecursive(folderPath) };
  });
}

//open a file
ipcMain.handle("open", async (_event, filePath: string) => {
  try {
    const content = readFileSync(filePath, "utf-8");
    console.log("📄 File content:", content);
    return content;
  } catch (err) {
    console.error("Failed to read file:", err);
    return null;
  }
});

// ipcMain.handle(
//   "create",
//   async (_event, filepath: string, code: string) => {
//     try {
//       // Resolve full path (src/components/<folder>/<Component>.tsx)
//       const filePath = join(__dirname, "../src/components", filepath);

//       console.log("📂 Received File path:", filePath);

//       // Ensure directory exists
//       const dir = dirname(filePath);
//       mkdirSync(dir, { recursive: true });

//       // Write AI code to file
//       writeFileSync(filePath, code, "utf8");

//       console.log("Component created at:", filePath);
//       return { success: true, filePath };
//     } catch (error) {
//       console.error("Error creating component:", error);
//       return { success: false, error: String(error) };
//     }
//   }
// );


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

      console.log("File created at:", filePath);
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

ipcMain.handle("create-folder", async (_event, folderPath: string) => {
  try {
    if (!folderPath) {
      return { success: false, error: "No folder path provided" };
    }

    mkdirSync(folderPath, { recursive: true });

    console.log("Folder created at:", folderPath);
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
