import { ipcMain, dialog } from "electron";
import { mkdirSync, readdirSync, statSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { readFileSync } from "fs";

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
              type: "folder",
              name,
              path: filePath,
              children: readDirRecursive(filePath),
            }
          : { type: "file", name, path: filePath };
      });
    }
    console.log("📂 File path:", folderPath);

    return { path: folderPath, tree: readDirRecursive(folderPath) };
  });
}

//open a file
ipcMain.handle("read", async (_event, filePath: string) => {
  try {
    const content = readFileSync(filePath, "utf-8");
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
  "create",
  async (_event, content?: string, filepath?: string, fileName?: string) => {
    try {
      console.log(fileName);
      // Show save dialog (user picks folder + types filename)
      const result = await dialog.showSaveDialog({
        title: "Create a new file",
        defaultPath: `${fileName}.txt`,
        // filters: [{ name: "TypeScript/TSX", extensions: ["tsx", "ts", "txt"] }],
      });

      if (result.canceled || !result.filePath) {
        return { success: false, error: "No file selected" };
      }

      const filePath = result.filePath;

      // Ensure directory exists
      const dir = dirname(filePath);
      mkdirSync(dir, { recursive: true });

      // Create file
      writeFileSync(filePath, content ?? "", "utf8");

      console.log("File created at:", filePath);
      return { success: true, filePath };
    } catch (error) {
      console.error("Error creating file:", error);
      return { success: false, error: String(error) };
    }
  }
);
