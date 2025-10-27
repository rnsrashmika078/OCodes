import { AuthUser, FilePath, Reply } from "./lib/types/type";

export {};

declare global {
  interface Window {
    electronAPI: {
      getMetadata: (filePath: string) => Promise<any>;
      initializeLLM: () => Promise<String>;
      onFsChange: (
        callback: (
          event: string,
          data: { event: string; filename: string; fullPath: string }
        ) => void
      ) => () => void;
    };
    chatgpt: {
      ask: (prompt: string, model: string) => Promise<Reply>;
    };
    auth: {
      setAuthUser: (AuthUser: AuthUser) => void;
      getAuthUser: () => Promise<AuthUser>;
    };
    updater: {
      onChecking(arg0: () => void): unknown;
      onError(arg0: (err: any) => void): unknown;
      checkForUpdate: () => void; // triggers update check
      installUpdate: () => void; // triggers update installation
      onUpdateAvailable: (
        callback: (info: { version: string; releaseNotes?: string }) => void
      ) => void;
      onUpdateDownloaded: (callback: () => void) => void; // called when update downloaded
    };
    fsmodule: {
      create: (
        filepath?: string,
        code?: string
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
        method?: string
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
        fileName?: string
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
