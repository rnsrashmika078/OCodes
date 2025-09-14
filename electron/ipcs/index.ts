import { ipcMain, dialog } from "electron";
import { mkdirSync, readdirSync, statSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { readFileSync } from "fs";

//import a project or folder
export function registerFileSystemHandlers() {
  ipcMain.handle("pick-project", async () => {
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

ipcMain.handle("read-file", async (_event, filePath: string) => {
  try {
    const content = readFileSync(filePath, "utf-8");
    return content;
  } catch (err) {
    console.error("Failed to read file:", err);
    return null;
  }
});

ipcMain.handle(
  "create-component",
  async (_event, filepath: string, code: string) => {
    try {
      // Resolve full path (src/components/<folder>/<Component>.tsx)
      const filePath = join(__dirname, "../src/components", filepath);

      console.log("📂 Received File path:", filePath);

      // Ensure directory exists
      const dir = dirname(filePath);
      mkdirSync(dir, { recursive: true });

      // Write AI code to file
      writeFileSync(filePath, code, "utf8");

      console.log("✅ Component created at:", filePath);
      return { success: true, filePath };
    } catch (error) {
      console.error("❌ Error creating component:", error);
      return { success: false, error: String(error) };
    }
  }
);
