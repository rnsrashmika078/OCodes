import { useEditor } from "@/lib/zustand/store";
import { useEffect, useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import CopyToClipboard from "../../custom/CopyToClipboard";
import Button from "../../custom/Button";
import { useGlobalContext } from "@/lib/context/GlobalContext";
import { parse } from "jsonc-parser";
import remarkGfm from "remark-gfm";

const ChatArea = () => {
  const { conversation, setConversation } = useGlobalContext();

  const setCopiedText = useEditor((store) => store.setCopiedText);
  const activeFile = useEditor((store) => store.activeFile);
  const setHeight = useEditor((store) => store.setHeight);
  const setUpdateActiveFile = useEditor((store) => store.setUpdateActiveFile);

  // handle resize
  useEffect(() => {
    const handleResize = () => setHeight(window.innerHeight);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setHeight]);

  const handleCopy = async (copiedText: string) => {
    try {
      if (document.hasFocus()) {
        await navigator.clipboard.writeText(copiedText);
        setCopiedText(copiedText);
      }
    } catch (error) {
      alert(error);
    }
  };

  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const [selectItem, setSelectItem] = useState<string>("Select Model");

  return (
    <div
      className="z-20 h-full relative overflow-x-hidden text-white custom-scrollbar w-full"
      ref={chatContainerRef}
    >
      {/* Message view area  */}
      <div>
        {conversation.map((msg) => {
          const data = parse(msg?.message);
          return (
            <div
              className={`w-full p-2`}
              //@ts-expect-error:this is key issue
              key={msg.messageId}
            >
              <div
                className={`w-full flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div className="bg-transparent px-2 py-1 rounded-xl">
                  <p className="text-[8px]">
                    {new Date().toLocaleTimeString([], {
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </p>
                  {msg.role === "user" && msg.message}
                </div>
              </div>
              <div className="flex flex-col w-full  px-2 py-1 rounded-xl">
                {msg.role === "assistant" && (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ children, ...props }) => (
                        <h1 className="text-2xl font-bold mb-2" {...props}>
                          {children}
                        </h1>
                      ),
                      h2: ({ children, ...props }) => (
                        <h2 className="text-xl font-semibold  mb-2" {...props}>
                          {children}
                        </h2>
                      ),
                      p: ({ children, ...props }) => (
                        <p className="text-white mb-2" {...props}>
                          {children}
                        </p>
                      ),
                      ul: ({ children, ...props }) => (
                        <ul className="list-disc ml-5 mb-2" {...props}>
                          {children}
                        </ul>
                      ),
                      ol: ({ children, ...props }) => (
                        <ol className="list-decimal ml-5 mb-2" {...props}>
                          {children}
                        </ol>
                      ),
                      li: ({ children, ...props }) => (
                        <li className="mb-1" {...props}>
                          {children}
                        </li>
                      ),
                    }}
                  >
                    {data?.reply}
                  </ReactMarkdown>
                )}
                {msg.role === "assistant" && data && data.code && (
                  <div className="whitespace-pre-wrap break-words">
                    <SyntaxHighlighter
                      language="javascript"
                      style={vscDarkPlus}
                      customStyle={{
                        borderRadius: "0.75rem",
                        padding: "1rem",
                        fontSize: "0.9rem",
                        overflowX: "auto",
                      }}
                      wrapLongLines
                    >
                      {String(data.code)}
                    </SyntaxHighlighter>
                    <Button onClick={() => setUpdateActiveFile(data?.code)}>
                      Update
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatArea;
