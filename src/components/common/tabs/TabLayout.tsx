"use client";
import React, { useEffect, useState } from "react";
import { RiCloseFill } from "react-icons/ri";
import { v4 as uuidv4 } from "uuid";

import { useChatClone } from "@/zustand/store";
import CodeEditor from "@/components/main/editor/CodeEditor";
import Preview from "@/components/main/editor/Preview";
import AskAI from "@/components/ask/AskAI";
import ChatArea from "@/components/chatarea/ChatArea";
import Button from "../Button";

interface TabLayout {
  className?: string;
}

const TabLayout = ({ className }: TabLayout) => {
  const [activeMouse, setActiveMouse] = useState<boolean>(false);
  const [turn, setTurn] = useState<boolean>(false);
  const setCloseFile = useChatClone((store) => store.setCloseFile);
  const setActiveFile = useChatClone((store) => store.setActiveFile);
  const openFiles = useChatClone((store) => store.openFiles);
  const activeFile = useChatClone((store) => store.activeFile);

  useEffect(() => {
    if (openFiles) {
      const lastFile = openFiles[openFiles.length - 1];
      if (lastFile) {
        const file = {
          id: lastFile?.id,
          name: lastFile?.name ?? "Untitled " + lastFile.id.slice(0, 2),
          type: lastFile?.type ?? "",
          path: lastFile?.path ?? "",
          content: lastFile?.content,
        };
        setActiveFile(file);
        return;
      }
    }
    return;
  }, [openFiles]);
  useEffect(() => {
    if (openFiles.length === 0) {
      setActiveFile(null);
      return;
    }
  }, [openFiles]);

  const handleCloseTab = (fileId: string) => {
    setCloseFile(fileId);
  };

  const [activeFileContent, setActiveFileContent] = useState<string>(
    activeFile?.content ?? ""
  );
  useEffect(() => {
    if (activeFileContent !== activeFile?.content) {
      console.log("Active file content as just changed!");
    }
  }, [activeFileContent, activeFile]);

  return (
    <div className={` flex flex-col w-full h-full select-none ${className}`}>
      <div className="relative flex flex-col h-full w-full">
        <div
          className={` sticky top-0 z-[9999] bg-[#1919197b]  transition-all flex flex-row text-center min-w-md `}
          onMouseEnter={() => setActiveMouse(true)}
          onMouseLeave={() => setActiveMouse(false)}
        >
          {openFiles?.map((tab, index: number) => (
            <div
              // @ts-expect-error: tab index issue
              key={index}
              onClick={() => {
                setActiveFile({
                  id: tab.id ?? "",
                  name: tab?.name ?? "Untitled " + tab.id.slice(0, 2),
                  type: tab?.type ?? "",
                  path: tab?.path ?? "",
                  content: tab.content,
                });
              }}
              className={`border relative border-[#434343]  flex justify-center transition-all duration-300 hover:cursor-pointer select-none  items-center w-1/2 sm:w-1/2 md:w-1/3 lg:w-1/5 xl:w-1/5 hover:bg-[#232222]  ${
                activeFile && activeFile.id === tab.id
                  ? "bg-[#232222] border-b-0 border-t-blue-500 border-t-4"
                  : "bg-[#1b1b1b7b]"
              } py-1`}
            >
              <p className="w-auto truncate text-white p-0.5 mx-5 text-sm  whitespace-nowrap overflow-hidden text-ellipsis max-w-md">
                {tab && tab?.name
                  ? tab?.name
                  : "Untitled " + tab.id.slice(0, 2)}
              </p>
              {/* content */}

              <div
                className="text-white absolute right-2 px-2 rounded-sm"
                onClick={() => {
                  handleCloseTab(tab.id);
                }}
              >
                <RiCloseFill />
              </div>
            </div>
          ))}
        </div>
        <Button name="Switch" onClick={() => setTurn((prev) => !prev)} />
        <Button name="Save" onClick={() => setTurn((prev) => !prev)} />
        <div className="w-full h-full">
          {turn ? <CodeEditor /> : <Preview code={activeFile?.content ?? ""} />}
        </div>
      </div>
      {/* <ChatArea /> */}
    </div>
  );
};

export default TabLayout;
// options={{
//   fontSize: 14,
//   minimap: { enabled: false },
//   wordWrap: "on",
//   scrollBeyondLastLine: false,
//   // scrollbar: {
//   //   vertical: "hidden",
//   //   horizontal: "hidden",
//   // },
// }}

{
}
