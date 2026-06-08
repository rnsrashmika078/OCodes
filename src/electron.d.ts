import { AuthUser, FilePath } from "./lib/types/type";

export {};

declare global {
  interface Window {
    // vite
    vite: {
      runViteServer: (projectPath: string) => Promise<string>;
    };
    electronAPI: {
      getMetadata: (filePath: string) => Promise<unknown>;
      onFsChange: (
        callback: (
          event: string,
          data: { event: string; filename: string; fullPath: string },
        ) => void,
      ) => () => void;
    };
    auth: {
      setAuthUser: (AuthUser: AuthUser) => void;
      getAuthUser: () => Promise<AuthUser>;
    };
    updater: {
      onChecking(arg0: () => void): unknown;
      onError(arg0: (err: unknown) => void): unknown;
      checkForUpdate: () => void;
      installUpdate: () => void;
      onUpdateAvailable: (
        callback: (info: { version: string; releaseNotes?: string }) => void,
      ) => void;
      onUpdateDownloaded: (callback: () => void) => void;
    };
    terminal: {
      cwd(directory: string): void;
      send(data: string): void;
      onData(cb: (data: string) => void): () => void;
      resize(cols: number, rows: number): void;
    };

    fsmodule: {
      create: (
        filepath?: string,
        code?: string,
      ) => Promise<{
        success: boolean;
        id: string;
        content?: string;
        filePath: string;
        name: string;
        type: string;
      }>;
      createFile: (
        content?: string,
        filepath?: string,
        fileName?: string,
        method?: string,
      ) => Promise<{
        id: string;
        success: boolean;
        filePath: string;
        name: string;
        type: string;
      }>;
      saveFile: (
        content?: string,
        filepath?: string,
        fileName?: string,
      ) => Promise<{
        id: string;
        success: boolean;
        filePath: string;
        name: string;
        type: string;
      }>;
      createFolder: (Path?: string) => Promise<{
        success: boolean;
        id: string;
        folderPath: string;
        name: string;
        type: string;
      }>;
      pick: () => Promise<FilePath>;
      refreshProject: (folderPath: string) => Promise<FilePath>;
      openFile: (filePath: string) => Promise<string>;
    };
  }
}
