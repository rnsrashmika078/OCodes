import AskAI from "../components/editor_ui/ai/AskAI";
import { useGlobalKey } from "@/lib/hooks/useGlobalKey";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/resizable";
import QuickBar from "@/components/editor_ui/sidebar/QuickBar";
import Explorer from "@/components/editor_ui/sidebar/tabs/explorer/Explorer";
import TabLayout from "@/components/custom/tabs_ui/TabLayout";
import ConsoleViewer from "@/components/editor_ui/editor/ConsoleViewer";
import ChatArea from "@/components/editor_ui/ai/ChatArea";
import { useState } from "react";
import TopBar from "@/components/editor_ui/topbar/Topbar";
const EditorUI = () => {
  //toggling ai chat area
  const [toggleState, setToggleState] = useState<boolean>(false);
  useGlobalKey(() => {
    setToggleState((prev) => !prev);
  });

  return (
    <div className="flex w-full flex-col h-full">
      <div className="w-full h-fit z-[99999]">
        <TopBar />
      </div>
      <div className="flex w-full h-full">
        <div className="flex w-14 h-full">
          <QuickBar />
        </div>
        <div className="flex w-full h-full">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={20} maxSize={50} minSize={0}>
              <div className="flex flex-col flex-1 w-full h-full overflow-hidden">
                <div className="flex-1 custom-scrollbar h-full w-[300px]">
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

export default EditorUI;
