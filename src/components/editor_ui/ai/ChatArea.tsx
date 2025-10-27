import { useEditor } from "@/lib/zustand/store";
import { useEffect, useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import CopyToClipboard from "../../custom/CopyToClipboard";
import Button from "../../custom/Button";
import {
  DropDownLayout,
  DropDownSection,
  Item,
} from "@/components/custom/dropdowns";

const ChatArea = () => {
  const userMessages = useEditor((store) => store.userMessages);
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

  // auto scroll
  // useEffect(() => {
  //   if (!chatContainerRef.current) return;

  //   chatContainerRef.current.scrollTo({
  //     top: chatContainerRef.current.scrollHeight,
  //     behavior: "smooth",
  //   });
  // }, [userMessages]);

  const [selectItem, setSelectItem] = useState<string>("Select Model");
  console.log(selectItem);

  return (
    <div
      className="z-20 h-full relative overflow-x-hidden text-white custom-scrollbar w-full"
      ref={chatContainerRef}
    >
      <DropDownLayout classname="absolute top-0">
        {selectItem}
        <DropDownSection
          select={selectItem}
          onSelect={(value) => setSelectItem(value)}
        >
          <Item value="Fuck" />
          <Item value="Suck" />
          <Item value="Lick" />
        </DropDownSection>
      </DropDownLayout>
      {userMessages?.map((msg, index) => (
        // @ts-ignore:remove key issue
        <div key={index} className="w-full">
          {/* USER MESSAGE */}
          <div className="py-8 px-1 w-full flex justify-end items-end">
            <div className="relative ">
              <p className="relative w-full font-custom shadow-md bg-[#3e3e3e] rounded-xl px-2 py-2">
                {msg.user}
              </p>
              <CopyToClipboard handleCopy={handleCopy} text={msg.user} />
            </div>
          </div>

          {/* AI MESSAGE */}
          <div className="justify-start p-5">
            {msg.ai === "loading" ? (
              <div className="relative font-custom">
                <span className="bg-white flex-shrink-0 h-3 w-3 animate-pulse p-2 flex rounded-full"></span>
              </div>
            ) : (
              <div className="whitespace-pre-wrap break-words">
                <ReactMarkdown
                  components={{
                    //@ts-expect-error:inline keyword not identify
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <div className="overflow-auto">
                          <Button
                            name="Update"
                            onClick={async () => {
                              await window.fsmodule.saveFile(
                                activeFile?.content ?? "",
                                activeFile?.path,
                                activeFile?.name
                              );
                              handleCopy(String(children).replace(/\n$/, ""));
                              setUpdateActiveFile(
                                String(children).replace(/\n$/, "")
                              );
                            }}
                          />
                          <SyntaxHighlighter
                            // @ts-ignore
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            customStyle={{
                              borderRadius: "0.75rem",
                              padding: "1rem",
                              fontSize: "0.9rem",
                              maxWidth: "100%",
                              overflowX: "auto",
                            }}
                            wrapLongLines
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        </div>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {msg.ai}
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
