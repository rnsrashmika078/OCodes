import { createContext, ReactNode, useContext, useState } from "react";
import { TThreads } from "../types/type";
export const GlobalContext = createContext<GlobalContextType | null>(null);

export type GlobalContextType = {
  threads: TThreads[];
  setThreads: React.Dispatch<React.SetStateAction<TThreads[]>>;

  activeThread: string | null;
  setActiveThread: React.Dispatch<React.SetStateAction<string | null>>;
};

export const GlobalContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [threads, setThreads] = useState<TThreads[]>([]);
  const [activeThread, setActiveThread] = useState<string | null>(null);

  return (
    <GlobalContext.Provider
      value={{ threads, setThreads, activeThread, setActiveThread }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be use within <Main Layout>");
  }
  return context;
}
