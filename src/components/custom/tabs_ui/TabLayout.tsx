import{ useEffect, useState } from "react";
import { RiCloseFill } from "react-icons/ri";
import { useEditor } from "@/lib/zustand/store";
import CodeEditor from "@/components/editor_ui/editor/CodeEditor";
import Preview from "@/components/editor_ui/editor/Preview";

import Button from "../Button";

interface TabLayout {
  className?: string;
}

const TabLayout = ({ className }: TabLayout) => {
  const [activeMouse, setActiveMouse] = useState<boolean>(false);
  const [turn, setTurn] = useState<string>("preview");
  const setCloseFile = useEditor((store) => store.setCloseFile);
  const setActiveFile = useEditor((store) => store.setActiveFile);
  const openFiles = useEditor((store) => store.openFiles);
  const activeFile = useEditor((store) => store.activeFile);

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
                className="text-white bg-black absolute right-1 px-1 rounded-sm"
                onClick={() => {
                  handleCloseTab(tab.id);
                }}
              >
                <RiCloseFill />
              </div>
            </div>
          ))}
        </div>
        <div className="flex w-full ">
          <Button
            name="Code Base"
            onClick={() => setTurn("code")}
            className={`${turn === "code" ? "bg-blue-500" : ""} w-full`}
          />
          <Button
            name="Preview"
            onClick={() => setTurn("preview")}
            className={`${turn === "preview" ? "bg-blue-500" : ""} w-full`}
          />
        </div>

        <div className="w-full h-full">
          {turn === "code" ? (
            <CodeEditor />
          ) : (
            <Preview code={activeFile?.content ?? ""} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TabLayout;
