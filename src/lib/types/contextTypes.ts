import { TThreads } from "./type";

export type GlobalContextType = {
  threads:TThreads[]
  setThreads: React.Dispatch<React.SetStateAction<TThreads[]>>;
};
