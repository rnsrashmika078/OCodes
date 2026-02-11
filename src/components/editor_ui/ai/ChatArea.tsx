import { useChat } from "@ai-sdk/react";
import { SetStateAction, useState } from "react";
import { DefaultChatTransport, type UIMessage } from "ai";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import { v4 as uuid } from "uuid";
import AskAI from "./AskAI";

const ChatArea = () => {
  // const { messages, sendMessage } = useChat({
  //   transport: new DefaultChatTransport({
  //     // api: "http://localhost:3000/api/chat",
  //     api: `${import.meta.env.VITE_PATH!}/api/chat`,
  //     // api: "http://localhost:3000/api/chat",
  //     headers: { "Content-Type": "application/json" },
  //   }),
  // });

  const [searchText, setSearchText] = useState("");
  type UserPrompt = {
    id: string;
    role: "assistant" | "user";
    message: string;
    type: "tool" | "text";
    content?: string;
    output_message?: string;
  };
  const [messages, setMessage] = useState<UserPrompt[]>([]);

  const handleSendMessage = async (prompt: string) => {
    const query = prompt;
    setSearchText("");
    setMessage((prev) => [
      ...prev,
      { id: uuid(), role: "user", message: query, type: "text" },
    ]);
    const result = await window.chatgpt.ask(query);
    if (result.toolResults.length > 0) {
      //@ts-expect-error:
      const output = result.toolResults[0].output?.message;
      //@ts-expect-error:
      const content = result.toolResults[0].input?.content;
      setMessage((prev) => [
        ...prev,
        {
          id: uuid(),
          role: "assistant",
          message: result.text,
          type: "tool",
          output_message: output,
          content,
        },
      ]);
      return;
    }
    setMessage((prev) => [
      ...prev,
      { id: uuid(), role: "assistant", message: result.text, type: "text" },
    ]);
  };
  return (
    // <div className="flex flex-col justify-between w-full h-full max-w-md p-5 mx-auto">
    <div className="flex flex-col justify-between h-full w-full custom-scrollbar">
      <div className="h-[625px] flex flex-col custom-scrollbar  p-5 ">
        {messages?.map((msg) => (
          <div
            //@ts-expect-error:key error
            key={msg.id}
            className={`flex flex-col  w-full p-2 ${
              msg.role === "user" ? "items-end" : "justify-start"
            }`}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children, ...props }) => (
                  <h1 className="text-white text-2xl font-bold" {...props}>
                    {children}
                  </h1>
                ),
                h2: ({ children, ...props }) => (
                  <h2 className="text-white text-xl font-semibold " {...props}>
                    {children}
                  </h2>
                ),
                p: ({ children, ...props }) => (
                  <p className="text-white mt-5 mb-5" {...props}>
                    {children}
                  </p>
                ),
                ul: ({ children, ...props }) => (
                  <ul className="text-white list-disc ml-5" {...props}>
                    {children}
                  </ul>
                ),
                ol: ({ children, ...props }) => (
                  <ol className="text-white list-decimal" {...props}>
                    {children}
                  </ol>
                ),
                li: ({ children, ...props }) => (
                  <li className="text-white" {...props}>
                    {children}
                  </li>
                ),
                code({ className, children }) {
                  const match = /language-(\w+)/.exec(className || "");

                  if (match) {
                    return (
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    );
                  }
                  return (
                    <code className="bg-zinc-600 px-1 rounded">{children}</code>
                  );
                },
              }}
            >
              {msg.type === "tool"
                ? `**Tool output:** ${msg.output_message ?? ""}\n\n\`\`\`jsx\n${
                    msg.content ?? ""
                  }\n\`\`\``
                : msg.message}
            </ReactMarkdown>
          </div>
        ))}
      </div>
      <div className="p-5">
        <AskAI
          searchText={searchText}
          handleClick={(search) => handleSendMessage(search)}
          setSearchText={setSearchText}
        />
      </div>
    </div>
  );
};

export default ChatArea;
