"use client";
import React, { useEffect, useState } from "react";
import { RiCloseFill } from "react-icons/ri";
import { v4 as uuidv4 } from "uuid";

import { useChatClone } from "@/zustand/store";
import CodeEditor from "@/components/main/editor/CodeEditor";

interface TabLayout {
  className?: string;
}

const TabLayout = ({ className }: TabLayout) => {
  const [activeMouse, setActiveMouse] = useState<boolean>(false);
  const setCloseFile = useChatClone((store) => store.setCloseFile);
  const setActiveFile = useChatClone((store) => store.setActiveFile);
  const openFiles = useChatClone((store) => store.openFiles);
  const activeFile = useChatClone((store) => store.activeFile);
  useEffect(() => {
    if (openFiles) {
      const lastFile = openFiles[openFiles.length - 1];
      if (lastFile && lastFile.node) {
        const file = {
          id: lastFile?.id,
          node: {
            name: lastFile?.node.name,
            type: lastFile?.node.type,
            path: lastFile?.node.path,
          },
          content: lastFile?.content,
        };
        setActiveFile(file);
        return;
      } else if (lastFile && !lastFile.node) {
        const file = {
          id: lastFile?.id,
          node: {
            name: "Untitled " + lastFile.id.slice(0, 2),
            type: "",
            path: "",
          },
          content: lastFile?.content,
        };
        alert(JSON.stringify(file));

        // setActiveTab(file);
        setActiveFile(file);
        return;
      } else {
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
  // const handleSaveTab = () => {
  //   if (editTabData) {
  //     setTabs((tabs) =>
  //       tabs.map((t: Tabs) =>
  //         t.id === editTabData.id
  //           ? {
  //               ...t,
  //               title: editTabData.title ? editTabData.title : "",
  //             }
  //           : t
  //       )
  //     );
  //   }
  //   // setCanEdit(false);
  //   setEditTabData({ title: "", id: 0 });
  // };

  // useEffect(() => {
  //   if (tabs.length === 0 && childCount > 0) {
  //     const id = Date.now();
  //     const newTabs = Array.from({ length: childCount }, (_, i) => ({
  //       id: id + i,
  //       title: `Tab ${i + 1}`,
  //     }));

  //     setTabs(newTabs);
  //     setActiveTab(newTabs[0]);
  //   }
  // }, [childCount, tabs.length]);

  console.log("Active file", activeFile);
  return (
    <div className={`flex flex-col w-full h-full  ${className}`}>
      <div className="flex flex-col h-full w-full">
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
                if (tab.node) {
                  setActiveFile({
                    id: tab.id,
                    node: {
                      name: tab.node.name,
                      type: tab.node.type,
                      path: tab.node.path,
                    },
                    content: tab.content,
                  });
                }
                // untitled doc or file
                else {
                  setActiveFile({
                    id: tab.id,
                    node: {
                      name: "Untitled " + tab.id.slice(0, 2),
                      type: "",
                      path: "",
                    },
                    content: tab.content,
                  });
                }
              }}
              className={`border relative border-[#434343]  flex justify-center transition-all duration-300 hover:cursor-pointer select-none  items-center w-1/2 sm:w-1/2 md:w-1/3 lg:w-1/5 xl:w-1/5 hover:bg-[#232222]  ${
                activeFile && activeFile.id === tab.id
                  ? "bg-[#232222] border-b-0 border-t-blue-500 border-t-4"
                  : "bg-[#1b1b1b7b]"
              } py-1`}
            >
              <p className="w-auto truncate text-white p-0.5 mx-5 text-sm  whitespace-nowrap overflow-hidden text-ellipsis max-w-md">
                {tab && tab.node?.name
                  ? tab.node?.name
                  : "Untitled " + tab.id.slice(0, 2)}
              </p>
              {/* content */}

              <div
                className="text-white absolute right-2 px-2 rounded-sm"
                onClick={() => {
                  if (tab.node) {
                    handleCloseTab(tab.id);
                  } else {
                    handleCloseTab(tab.id);
                  }
                }}
              >
                <RiCloseFill />
              </div>
            </div>
          ))}
        </div>
        <CodeEditor activeTab={activeFile!} />
      </div>
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
