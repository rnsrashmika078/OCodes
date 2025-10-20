import { useChatClone } from "@/zustand/store";
import AskAI from "../../ask/AskAI";
import { motion } from "framer-motion";
import ChatArea from "../../chatarea/ChatArea";
import { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import Nav from "../../nav/Nav";
import Splitter from "@/components/common/splitter/Splitter";
import TabLayout from "@/components/common/tabs/TabLayout";
import Tab from "@/components/common/tabs/Tab";
import QuickBar from "../sidebar/QuickBar";
import Explorer from "../sidebar/tabs/explorer/Explorer";
import { Tree } from "@/types/type";
import { BiUpload } from "react-icons/bi";
import Topbar from "../topbar/Topbar";
import { useGlobalKey } from "@/hooks/useGlobalKey";
import Preview from "../editor/Preview";
import Button from "@/components/common/Button";

const Layout = () => {
  const height = useChatClone((store) => store.height);
  const [isToggle, setIsToggle] = useState<boolean>(true);
  const openFiles = useChatClone((store) => store.openFiles);
  const activeFile = useChatClone((store) => store.activeFile);
  const setUpdateActiveFile = useChatClone(
    (store) => store.setUpdateActiveFile
  );

  const [dragWidth, setDragWidth] = useState<{
    width: number;
    height: number;
    widthFlip: number;
    id: number;
  }>({
    width: 300,
    height: 200,
    widthFlip: 0,
    id: 0,
  });
  const [toggleState, setToggleState] = useState<boolean>(false);
  useGlobalKey(() => {
    setToggleState((prev) => !prev);
  });

  useEffect(() => {
    setDragWidth({ ...dragWidth, widthFlip: toggleState ? 300 : 0 });
  }, [toggleState]);

  const toggleSidebar = (state?: boolean) => {
    if (state !== undefined) setIsToggle(state);
    else setIsToggle((prev) => !prev);
  };

 

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex flex-col justify-between h-full">
        {/* Top bar */}
        <Topbar />

        {/* Middle area (Sidebar + Main) */}
        <div className="flex w-full flex-1 overflow-hidden">
          {/* Sidebar with splitter */}
          <div
            className={`relative flex`}
            style={{ width: `${dragWidth.width}px` }}
          >
            <div className="flex h-full">
              <QuickBar />
            </div>
            <Explorer />

            <Splitter
              splitterId={1}
              onMouseEnter={() => setDragWidth({ ...dragWidth, id: 1 })}
              setDragWidth={setDragWidth}
              min={56}
              max={600}
              type="horizontal"
              dragWidth={dragWidth}
            />
          </div>

          {/* Main content area */}
          <div className="flex flex-col flex-1 w-full h-full">
            {/* Top section (tabs + editor) */}
            <div className="flex-1  custom-scrollbar h-full w-full">
              <TabLayout />
            </div>

            {/* Splitter bar */}
            <div className="h-2 bg-[#232222] cursor-row-resize relative">
             

              <Splitter
                splitterId={2}
                onMouseEnter={() => setDragWidth({ ...dragWidth, id: 2 })}
                setDragWidth={setDragWidth}
                min={0}
                max={400}
                type="vertical"
                dragWidth={dragWidth}
              />
            </div>

            {/* Bottom panel */}
            <div
              className="w-full bg-[#1e1e1e]"
              style={{ height: `${dragWidth.height}px` }}
            >
              {/* bottom panel content */}
            </div>
          </div>
          {/* test */}

          {/* <Button
            name="Update"
            onClick={() => {
              setUpdateActiveFile(code);
            }}
          /> */}
          <div
            className={`relative flex`}
            style={{ width: `${dragWidth.widthFlip}px` }}
          >
            <div className=" w-full h-full p-2">
              <div className="relative w-full h-[650px] ">
                <ChatArea />
              </div>
              <div className="absolute bottom-0 w-full px-5">
                <AskAI />
              </div>
            </div>
            <Splitter
              splitterId={3}
              onMouseEnter={() => setDragWidth({ ...dragWidth, id: 3 })}
              setDragWidth={setDragWidth}
              min={0}
              max={600}
              type="horizontalFlip"
              dragWidth={dragWidth}
            />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col w-full h-5 bg-red-500"></div>
      </div>
    </div>
  );
};

export default Layout;
