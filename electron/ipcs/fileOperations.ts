import { BrowserWindow } from "electron/main";
import path from "path";
import os from "os";
import fs from "fs/promises";

//import a project or folder
export const resolvePath = () => {
  const desktop = path.join(os.homedir(), "Desktop", "fuck-this-shit.txt");
  console.log("desktop location", desktop);
  return desktop;
};

export function handleFileOperations(mainWindow: BrowserWindow | null) {
  const loc = resolvePath();

  if (loc == "") {
    return;
  }
  createFile(loc, "hi brother");
}

export async function createFile(location: string, content: string) {
  await fs.mkdir(path.dirname(location), { recursive: true });
  await fs.writeFile(location, content);
}
