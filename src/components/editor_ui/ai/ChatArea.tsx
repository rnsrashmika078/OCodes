/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useMemo, useState } from "react";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import { v4 as uuid } from "uuid";
import AskAI from "./AskAI";
import { CgSpinner } from "react-icons/cg";
import GenerativeComponent from "@/components/generative_component/GenerativeComponent";
import { ExtendedMessage } from "@/lib/types/type";
import { useChat, useEditor } from "@/lib/zustand/store";
import {
  FetchStreamTransport,
  useStream,
} from "@langchain/langgraph-sdk/react";
import ChatMessages from "./ChatMessage";
const ChatArea = memo(() => {
  const [searchText, setSearchText] = useState("");

  const appendMessages = useChat((store) => store.appendMessages);
  const updateMessage = useChat((store) => store.updateMessage);

  const transport = useMemo(() => {
    // const apiKeyValue = apiKey;
    return new FetchStreamTransport({
      apiUrl: "http://localhost:3000/api/chat",
    });
  }, []);

  const { messages, submit, isLoading, stop } = useStream({
    transport,
  });
  const formattedMessage = useMemo(() => {
    return messages.map(
      (msg) =>
        ({
          ...msg,
          additional_kwargs: msg.additional_kwargs,
          // invalid_tool_calls: msg.type === "ai" ? msg.invalid_tool_calls : null,
          // tool_calls: msg.type === "ai" ? msg.tool_calls : null,
        }) as ExtendedMessage,
    );
  }, [messages]);

  return (
    <div className="flex flex-col justify-between h-full w-full custom-scrollbar">
      <div className="w-full">
        {/* {JSON.stringify(toolCalls[0])} */}
        {formattedMessage && formattedMessage.length > 0 && (
          <ChatMessages
            isLoading={isLoading}
            // addToolApprovalResponse={addToolApprovalResponse}
            messages={formattedMessage}
            // regenerate={regenerate}
            // status={status}
          />
        )}
      </div>
      <div className="p-5">
        <AskAI
          searchText={searchText}
          handleClick={(search) => {
            submit({
              messages: [...messages, { content: search, type: "human" }],
            });
          }}
          setSearchText={setSearchText}
        />
      </div>
    </div>
  );
});

ChatArea.displayName = "ChatArea";

export default ChatArea;
