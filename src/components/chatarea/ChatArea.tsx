import { useChatClone } from "@/zustand/store";
import { useEffect, useRef } from "react";
// @ts-expect-error:import path error
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// @ts-expect-error:import path error
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import CopyToClipboard from "../common/CopyToClipboard";
import ReactMarkdown from "react-markdown";
import Button from "../common/Button";
const ChatArea = () => {
  type Lang = "javascript" | "java" | "c++" | "c" | "jsx" | "python";
  const supportedLanguages: Lang[] = [
    "javascript",
    "java",
    "c++",
    "c",
    "python",
    "jsx",
  ];

  function detectLanguage(message: string): Lang | null {
    const lowerMsg = message.toLowerCase();
    for (const lang of supportedLanguages) {
      if (lowerMsg.includes(lang)) {
        return lang;
      }
    }
    return null;
  }
  const userMessages = useChatClone((store) => store.userMessages);
  const setCopiedText = useChatClone((store) => store.setCopiedText);
  const setHeight = useChatClone((store) => store.setHeight);

  useEffect(() => {
    const handleResize = () => {
      const height = window.innerHeight;
      if (height) setHeight(height);
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [userMessages]);

  return (
    <div
      className="z-20 m-auto px-2 h-full overflow-x-hidden text-white"
      ref={chatContainerRef}
    >
      {/* <UpdateButton /> */}
      {userMessages &&
        userMessages?.map((msg, index) => (
          // @ts-ignore
          <div key={index} className="w-full">
            <div className={`p-4 w-full flex justify-end items-end`}>
              {/* // 🟢 USER MESSAGE */}
              <div className="relative w-fit p-5">
                <p className="relative font-custom shadow-md bg-[#3e3e3e] rounded-xl px-2 py-2 max-w-full overflow-x-auto">
                  {msg.user}
                </p>
                <CopyToClipboard handleCopy={handleCopy} text={msg.user} />
              </div>
            </div>
            <div className="justify-start">
              {msg.ai === "loading" ? (
                // 🟡 LOADING DOT
                <div className="relative font-custom">
                  <span className="bg-white flex-shrink-0 h-3 w-3 animate-pulse p-2 flex rounded-full"></span>
                </div>
              ) : (
                // 🔵 AI RESPONSE
                <div className="whitespace-pre-wrap break-words">
                  <ReactMarkdown>
                    {msg.ai.split("```")[0] ?? msg.ai}
                  </ReactMarkdown>
                  <SyntaxHighlighter
                    language={detectLanguage(msg.ai)}
                    style={vscDarkPlus}
                    customStyle={{
                      borderRadius: "0.75rem",
                      padding: "1rem",
                      fontSize: "0.9rem",
                      maxWidth: "100%",
                      overflowX: "auto",
                    }}
                    wrapLongLines={true}
                  >
                    {msg.ai && msg.ai.split("```")[1]}
                  </SyntaxHighlighter>
                  <ReactMarkdown>
                    {msg.ai.split("```")[2] ?? msg.ai}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

export default ChatArea;
