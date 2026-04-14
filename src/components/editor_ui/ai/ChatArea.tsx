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

  const request = async (prompt: string) => {
    setSearchText("");
    setMessage((prev) => [
      ...prev,
      { id: uuid(), role: "user", message: prompt, type: "text" },
    ]);

    const res = await fetch("http://localhost:8000/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ request: prompt }),
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder("utf-8");

    const aiUUID = uuid();
    setMessage((prev) => [
      ...prev,
      { id: aiUUID, role: "assistant", message: "", type: "text" },
    ]);
    let result = "";
    while (true) {
      if (!reader) return;
      const { done, value } = await reader.read();

      if (done) break;

      const chunk = decoder.decode(value, { stream: true });

      result += chunk;

      setMessage((prev) =>
        prev.map((msg) =>
          msg.id === aiUUID ? { ...msg, message: result } : msg,
        ),
      );
    }
  };

  return (
    <div className="flex flex-col justify-between h-full w-full custom-scrollbar">
      <div className="h-[625px] flex flex-col custom-scrollbar  p-5 ">
        {messages?.map((msg) => (
          <div
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
                  <p className="text-white" {...props}>
                    {children}
                  </p>
                ),
                ul: ({ children, ...props }) => (
                  <ul className="text-white list-disc " {...props}>
                    {children}
                  </ul>
                ),
                ol: ({ children, ...props }) => (
                  <ol className="text-white list-decimal " {...props}>
                    {children}
                  </ol>
                ),
                li: ({ children, ...props }) => (
                  <li className="text-white " {...props}>
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
                    <code className="text-white  rounded">{children}</code>
                  );
                },
              }}
            >
              {/* {msg.type === "tool"
                ? `**Tool output:** ${msg.output_message ?? ""}\n\n\`\`\`jsx\n${
                    msg.content ?? ""
                  }\n\`\`\``
                : msg.message} */}
              {msg.message}
            </ReactMarkdown>
          </div>
        ))}
      </div>
      <div className="p-5">
        <AskAI
          searchText={searchText}
          handleClick={(search) => request(search)}
          setSearchText={setSearchText}
        />
      </div>
    </div>
  );
};

export default ChatArea;
