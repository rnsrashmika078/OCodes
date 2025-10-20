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
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/resizable";
import ConsoleViewer from "../editor/ConsoleViewer";
const Layout2 = () => {
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
    <div className="flex w-full flex-col h-full">
      <div className="w-full h-fit">
        <Topbar />
      </div>
      <div className="flex w-full h-full">
        <div className="flex w-14 h-full">
          <QuickBar />
        </div>
        <div className="flex w-full h-full">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={20} maxSize={20} minSize={0}>
              <div className="flex flex-col flex-1 w-full h-full">
                <div className="flex-1  custom-scrollbar h-full w-full flex-shrink-0">
                  <Explorer />
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle className="bg-gray-600" />
            <ResizablePanel>
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel>
                  <div className="flex flex-col flex-1 w-full h-full">
                    <div className="flex-1  custom-scrollbar h-full w-full">
                      <TabLayout />
                    </div>
                  </div>
                </ResizablePanel>
                <ResizableHandle className="bg-gray-600" />
                <ResizablePanel>
                  <div className="flex flex-col flex-1 w-full h-full">
                    <div className="flex-1  custom-scrollbar h-full w-full">
                      <div className="bg-black text-green-400 font-mono p-2 h-full overflow-y-auto">
                        <ConsoleViewer />
                      </div>
                    </div>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
            <ResizableHandle className="bg-gray-600" />
            {toggleState && (
              <ResizablePanel>
                <div className="w-full h-full">
                  <div className="relative w-full h-full">
                    <div className="absolute w-full h-[650px] overflow-y-auto">
                      <ChatArea />
                    </div>{" "}
                    <div className="absolute bottom-0 w-full p-5">
                      <AskAI />
                    </div>
                  </div>
                </div>
              </ResizablePanel>
            )}
            <ResizableHandle className="bg-gray-600" />
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  );
};

export default Layout2;
