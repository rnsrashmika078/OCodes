import { create } from "zustand";
import {
  AuthUser,
  FilePath,
  OpenFile,
  Tree,
  UpdateChat,
  UserMessage,
} from "@/types/type";
import { insertNodeAtPath } from "@/lib/insertNodeAtPath"; // import here

type ChatStore = {
  height: number;
  loading: boolean;
  trackId: string | null;
  chats: UpdateChat[] | null;
  authUser: AuthUser | null;
  userMessages: UserMessage[] | null;
  notifier: String | null;
  copiedText: string | null;
  activeChat: UpdateChat | null;

  // new store items
  project: FilePath | null;
  openFiles: OpenFile[];
  activeFile: OpenFile | null;
  clickedFileCurrentPath: string | null;

  setUserMessages: (message: UserMessage | null) => void;
  setLoading: (isLoading: boolean) => void;
  setHeight: (currentHeight: number) => void;
  setNotification: (notifier: string | null) => void;
  setUpdateMessage: (id: string, message: string) => void;
  setAuthUser: (authData: AuthUser | null) => void;
  setChats: (chat: UpdateChat) => void;
  setAllmessage: (messages: UserMessage[]) => void;
  updateChats: (mutateChats: UpdateChat[]) => void;
  setActiveChat: (chatData: UpdateChat | null) => void;
  deleteChat: (id: string) => void;
  setTrackId: (id: string | null) => void;
  setCopiedText: (copiedText: string | null) => void;

  // new store items
  setProject: (project: FilePath | null) => void;
  setInsertFolderToProject: (newNode: Tree, targetPath: string) => void;
  setInsertFileToProject: (newNode: Tree, targetPath: string) => void;
  setUpdateProjectFile: (updateFile: OpenFile) => void;
  setOpenFiles: (file: OpenFile) => void;
  setCloseFile: (fileId: string) => void;
  setCreateFile: (file: OpenFile) => void;
  setActiveFile: (file: OpenFile | null) => void;
  setUpdateOpenFiles: (file: OpenFile) => void;
  setClickedFileCurrentPath: (path: string | null) => void;
};

type ActiveTabStore = {
  tab: string;
  setActiveTab: (tab: string) => void;
};

export const useChatClone = create<ChatStore>((set) => ({
  userMessages: null,
  notifier: null,
  trackId: null,
  authUser: null,
  loading: false,
  chats: null,
  userPreference: { netstats: false, authstats: false },
  activeChat: null,
  height: window.innerHeight,
  copiedText: null,
  clickedFileCurrentPath: null,

  // new store items
  project: null,
  openFiles: [],
  activeFile: null,

  setUserMessages: (message: UserMessage | null) =>
    set((state) => ({
      userMessages: message ? [...(state.userMessages ?? []), message] : [],
    })),

  setHeight: (currentHeight) => set(() => ({ height: currentHeight })),
  setNotification: (notifier) => set(() => ({ notifier })),
  setLoading: (isLoading) => set(() => ({ loading: isLoading })),
  setAuthUser: (authData) => set(() => ({ authUser: authData })),
  setChats: (chats) =>
    set((state) => ({ chats: [...(state.chats ?? []), chats] })),
  setActiveChat: (chatData) => set(() => ({ activeChat: chatData })),
  setUpdateMessage: (id, message) =>
    set((state) => ({
      userMessages: state.userMessages?.map((msg) =>
        msg.messageId === id ? { ...msg, ai: message } : msg
      ),
    })),
  setAllmessage: (messages) => set(() => ({ userMessages: messages })),
  updateChats: (mutateChats) => set(() => ({ chats: mutateChats })),
  deleteChat: (id) =>
    set((state) => ({
      chats: state.chats?.filter((ch) => ch.chatId !== id),
    })),
  setTrackId: (id) => set(() => ({ trackId: id })),
  setCopiedText: (text) => set(() => ({ copiedText: text })),

  // new store items
  setProject: (filepath) => set(() => ({ project: filepath })),
  setInsertFolderToProject: (newNode, targetPath) =>
    set((state) => ({
      project: {
        ...state.project,
        path: state.project?.path ?? "",
        tree: insertNodeAtPath(state.project?.tree ?? [], targetPath, newNode),
      },
    })),
  setInsertFileToProject: (newNode, targetPath) =>
    set((state) => ({
      project: {
        ...state.project,
        path: state.project?.path ?? "",
        tree: insertNodeAtPath(state.project?.tree ?? [], targetPath, newNode),
      },
    })),
  setUpdateProjectFile: (updateFile) =>
    set((state) => ({
      project: state.project
        ? {
            ...state.project, // keep `path`
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
                : f
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
        f?.id === file.id ? { ...f, ...file } : f
      ),
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
