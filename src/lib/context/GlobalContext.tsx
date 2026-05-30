import { createContext, ReactNode, useContext, useState } from "react";
import { GlobalContextType } from "../types/contextTypes";
import { TThreads } from "../types/type";
export const GlobalContext = createContext<GlobalContextType | null>(null);

export const GlobalContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [threads, setThreads] = useState<TThreads[]>([]);
  return (
    <GlobalContext.Provider value={{ threads, setThreads }}>
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
