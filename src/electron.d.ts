import { AuthUser, FilePath, Reply } from "./types/type";

export {};

declare global {
  interface Window {
    electronAPI: {
      getMetadata: (filePath: string) => Promise<any>;
      initializeLLM: () => Promise<String>;
    };
    chatgpt: {
      ask: (prompt: string) => Promise<Reply>;
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
      create: (filepath: string, code: string) => Promise<string, string>;
      pickProject: () => Promise<FilePath>;
      openFile: (filePath: string) => Promise<string>;
    };
  }
}
