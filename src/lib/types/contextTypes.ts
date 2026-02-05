import { Conversation } from "./type";

export type GlobalContextType = {
  conversation: Conversation[];
  setConversation: React.Dispatch<React.SetStateAction<Conversation[]>>;
};
