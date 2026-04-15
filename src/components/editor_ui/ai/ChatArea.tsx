import { useState } from "react";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import { v4 as uuid } from "uuid";
import AskAI from "./AskAI";
import { CgSpinner } from "react-icons/cg";
import Assistant from "@/components/generative_component/Assistant";
import Time from "@/components/generative_component/Time";

const ChatArea = () => {
  const [searchText, setSearchText] = useState("");
  type UserPrompt = {
    id: string;
    role: "assistant" | "user";
    message: string;
    type: "tool" | "text";
    content?: any[];
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
      { id: aiUUID, role: "assistant", message: "loading", type: "text" },
    ]);
    let result = "";
    let buffer = "";

    while (true) {

      if (!reader) return;
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const parts = buffer.split("\n");
      buffer = parts.pop() || "";

      for (const part of parts) {
        if (!part.trim()) continue;

        const parsed = JSON.parse(part);

        if (parsed.type === "tool") {
          result += parsed.message;

          setMessage((prev) =>
            prev.map((msg) =>
              msg.id === aiUUID
                ? { ...msg, message: result, content: parsed.content }
                : msg,
            ),
          );
        }

      }
    }
  };

  console.log("Messages", messages);
  return (
    <div className="flex flex-col justify-between h-full w-full custom-scrollbar">
      <div className="h-full flex flex-col custom-scrollbar  p-5 ">
        {messages?.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col  w-full p-2 ${
              msg.role === "user" ? "items-end" : "justify-start"
            }`}
          >
            {msg.role === "assistant" && msg.message.startsWith("loading") && (
              <div>
                <CgSpinner className="animate-spin" />
              </div>
            )}
            {/* {msg.content && msg.role === "assistant" && <Assistant />} */}
            {msg.content && msg.role === "assistant" && (
              <Time content={msg.content[0]} />
            )}
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children, ...props }) => (
                  <h1 className="text-white text-2xl font-bold" {...props}>
                    {children}
                  </h1>
                ),
                h2: ({ children, ...props }) => (
                  <h2 className=" text-xl font-semibold " {...props}>
                    {children}
                  </h2>
                ),
                p: ({ children, ...props }) => (
                  <p className="text-white" {...props}>
                    {children}
                  </p>
                ),
                ul: ({ children, ...props }) => <ul {...props}>{children}</ul>,
                ol: ({ children, ...props }) => (
                  <ol className="text-white " {...props}>
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
              {msg.message.startsWith("loading") ? "" : msg.message}
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
