import {
  useStream,
  FetchStreamTransport,
} from "@langchain/langgraph-sdk/react";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import type { BaseMessage } from "@langchain/core/messages";
import ReactMarkdown from "react-markdown";
import { useState, useMemo } from "react";
import AskAI from "./AskAI";
interface AgentState {
  messages: BaseMessage[];
}
const ChatAreaV2 = () => {
  const [searchText, setSearchText] = useState("");

  // 1. Create the transport to point to your Express Route
  const transport = useMemo(
    () =>
      new FetchStreamTransport({
        apiUrl: "http://localhost:3000/api/chat", // Your Express server
      }),
    [],
  );

  // 2. Initialize the stream with the custom transport
  const stream = useStream<AgentState>({
    transport,
    // Note: threadId is usually handled here or in the submit options
    // to maintain conversation state
  });

  const handleSubmit = (text: string) => {
    if (!text.trim()) return;

    // 3. Submit matches the input schema the agent expects
    stream.submit({
      messages: [
        {
          role: "human",
          input: searchText, // Explicitly using the array format
        },
      ],
    });

    setSearchText("");
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4">
        {/* {stream.messages.map((msg) => {
          const isAI = msg instanceof AIMessage;
          const isHuman = msg instanceof HumanMessage;
          const content = typeof msg.content === "string" ? msg.content : "";

          if (isAI) {
            return (
              <div key={msg.id} className="bg-gray-100 p-3 my-2 rounded">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            );
          }
          if (isHuman) {
            return (
              <div
                key={msg.id}
                className="bg-blue-100 p-3 my-2 rounded self-end"
              >
                <p>{content}</p>
              </div>
            );
          }
          return null;
        })} */}

        {/* Loading state indicator */}
        {stream.isLoading && (
          <p className="text-gray-400 italic">AI is thinking...</p>
        )}
      </div>

      <div className="p-5 border-t">
        <AskAI
          searchText={searchText}
          handleClick={(search) => handleSubmit(search)}
          setSearchText={setSearchText}
        />
      </div>
    </div>
  );
};

export default ChatAreaV2;
