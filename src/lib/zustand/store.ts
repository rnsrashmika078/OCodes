import { create } from "zustand";
import { AuthUser, ChatMessages, FilePath, OpenFile, Tree } from "@/lib/types/type";

type FileOperation = {
  height: number;
  loading: boolean;
  trackId: string | null;
  authUser: AuthUser | null;
  notifier: string | null;
  copiedText: string | null;

  // new store items
  project: FilePath | null;
  openFiles: OpenFile[];
  activeFile: OpenFile | null;
  clickedFileCurrentPath: string | null;

  setLoading: (isLoading: boolean) => void;
  setHeight: (currentHeight: number) => void;
  setNotification: (notifier: string | null) => void;
  setAuthUser: (authData: AuthUser | null) => void;
  setTrackId: (id: string | null) => void;
  setCopiedText: (copiedText: string | null) => void;

  // new store items
  setProject: (project: FilePath | null) => void;
  setExpandedStatus: (id: string) => void;

  setUpdateProjectFile: (updateFile: OpenFile) => void;
  setOpenFiles: (file: OpenFile) => void;
  setCloseFile: (fileId: string) => void;
  setCreateFile: (file: OpenFile) => void;
  setActiveFile: (file: OpenFile | null) => void;
  setUpdateActiveFile: (content: string) => void;
  setUpdateOpenFiles: (file: OpenFile) => void;
  setClickedFileCurrentPath: (path: string | null) => void;
};

type ActiveTabStore = {
  tab: string;
  setActiveTab: (tab: string) => void;
};

export const useEditor = create<FileOperation>((set) => ({
  notifier: null,
  trackId: null,
  authUser: null,
  loading: false,
  userPreference: { netstats: false, authstats: false },

  height: window.innerHeight,
  copiedText: null,
  clickedFileCurrentPath: null,

  //chat related varaibles

  //files related variables
  project: null,
  openFiles: [],
  activeFile: null,

  setHeight: (currentHeight) => set(() => ({ height: currentHeight })),
  setNotification: (notifier) => set(() => ({ notifier })),
  setLoading: (isLoading) => set(() => ({ loading: isLoading })),
  setAuthUser: (authData) => set(() => ({ authUser: authData })),

  //chat reacte functions

  setTrackId: (id) => set(() => ({ trackId: id })),
  setCopiedText: (text) => set(() => ({ copiedText: text })),

  //file related functions
  // new store items
  setProject: (filepath) => set(() => ({ project: filepath })),
  setExpandedStatus: (id) =>
    set((state) => {
      if (!state.project) return { project: null };

      const toggleNode = (nodes: Tree[]): Tree[] => {
        return nodes.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              isExpanded: !node.isExpanded,
            };
          }

          if (node.children) {
            return {
              ...node,
              children: toggleNode(node.children),
            };
          }

          return node;
        });
      };

      return {
        project: {
          ...state.project,
          tree: toggleNode(state.project.tree),
        },
      };
    }),
  setUpdateProjectFile: (updateFile) =>
    set((state) => ({
      project: state.project
        ? {
            ...state.project,
            tree: state.project.tree.map((f) =>
              f.id === updateFile.id
                ? {
                    ...f,
                    id: updateFile.id ?? "",
                    name: updateFile.name ?? "",
                    path: updateFile.path ?? "",
                    type: updateFile.type ?? "",
                    children: f.children ?? [], // keep children if they exist
                  }
                : f,
            ),
          }
        : null,
    })),
  setOpenFiles: (files) =>
    set((state) => ({
      openFiles: [...(state.openFiles ?? []), files],
    })),
  setCloseFile: (fileId) =>
    set((state) => ({
      openFiles: state.openFiles.filter((file) => file.id !== fileId),
    })),
  setCreateFile: (file) =>
    set((state) => ({
      openFiles: [...(state.openFiles ?? []), file],
    })),
  setActiveFile: (file) =>
    set(() => ({
      activeFile: file,
    })),
  setUpdateOpenFiles: (file) =>
    set((state) => ({
      openFiles: state.openFiles.map((f) =>
        f?.id === file.id ? { ...f, ...file } : f,
      ),
    })),
  setUpdateActiveFile: (content) =>
    set((state) => ({
      activeFile: state.activeFile ? { ...state.activeFile, content } : null,
    })),
  setClickedFileCurrentPath: (path) =>
    set(() => ({
      clickedFileCurrentPath: path,
    })),
}));

export const useActiveTab = create<ActiveTabStore>((set) => ({
  tab: "Home",
  setActiveTab: (tab) => set({ tab }),
}));

type ChatStore = {
  //variables
  messages: ChatMessages[] | null;

  //functions
  appendMessages: (newMessage: ChatMessages) => void;
  updateMessage: (updateMessage: ChatMessages, id: string) => void;
  deleteMessage: (id: string) => void;
};

export const useChat = create<ChatStore>((set) => ({
  //variables
  messages: null,

  //functions

  //append Messages
  appendMessages: (newMessage: ChatMessages) =>
    set((state) => ({
      messages: [...(state.messages ?? []), newMessage],
    })),
  //update Messages

  updateMessage: (updateMessage: ChatMessages, id: string) =>
    set((state) => ({
      messages: state.messages?.map((msg) =>
        msg.id === id ? { ...msg, ...updateMessage } : msg,
      ),
    })),
  //delete messages
  deleteMessage: (id: string) =>
    set((state) => ({
      messages: state.messages?.filter((msg) => msg.id !== id),
    })),
}));
