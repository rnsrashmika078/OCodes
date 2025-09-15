import { useChatClone } from "@/zustand/store";
import AskAI from "../../ask/AskAI";
import { motion } from "framer-motion";
import ChatArea from "../../chatarea/ChatArea";
import { useState } from "react";
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

const Layout = () => {
  const height = useChatClone((store) => store.height);
  const [isToggle, setIsToggle] = useState<boolean>(true);
  const openFiles = useChatClone((store) => store.openFiles);

  const [dragWidth, setDragWidth] = useState<{
    width: number;
    height: number;
    id: number;
  }>({
    width: 300,
    height: 200,
    id: 0,
  });

  const toggleSidebar = (state?: boolean) => {
    if (state !== undefined) setIsToggle(state);
    else setIsToggle((prev) => !prev);
  };

  console.log("openFiles", openFiles);

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
          <div className="flex flex-col flex-1 w-full h-full bg-red-500">
            {/* Top section (tabs + editor) */}
            <div className="flex-1  custom-scrollbar h-full w-full bg-blue-500">
              <TabLayout />
              {/* <div>hi there</div> */}
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
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col w-full h-5 bg-red-500"></div>
      </div>
    </div>
  );
};

export default Layout;
