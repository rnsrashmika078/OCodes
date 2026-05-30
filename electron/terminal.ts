import { BrowserWindow, ipcMain } from "electron";
import pty from "node-pty";

// const shell = process.platform === "win32" ? "cmd.exe" : "bash";
const shell = process.platform === "win32" ? "powershell.exe" : "bash";
export const initTerminal = (win: BrowserWindow) => {
  // const policy_powershell =
  //   "Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned";
  let ptyProcess: pty.IPty | null = null;

  ipcMain.on("terminal:cwd", (_, directory) => {

    if (ptyProcess) {
      ptyProcess.kill();
    }

    ptyProcess = pty.spawn(shell, [], {
      name: "xterm-color",
      cols: 80,
      rows: 30,
      cwd: directory,
      env: process.env,
    });
    // ptyProcess.write(policy_powershell);

    ptyProcess.onData((data) => {
      win.webContents.send("terminal:data", data);
    });
  });

  ipcMain.on("terminal:write", (_, data) => {
    ptyProcess?.write(data);
  });

  ipcMain.on("terminal:resize", (_, cols, rows) => {
  
    ptyProcess?.resize(cols, rows);
  });
};
