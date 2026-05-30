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
import { memo, useState } from "react";
import TopBar from "@/components/editor_ui/topbar/topbar";
import ProgressBar from "@/components/custom/progress_bar";
import FlowExample from "@/components/custom/generative/flow";

const EditorUI = memo(() => {
  const [toggleState, setToggleState] = useState<boolean>(false);
  useGlobalKey(() => {
    setToggleState((prev) => !prev);
  });
  console.log("Rendering: EditorUI.tsx ");

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
              <div className="custom-scrollbar h-full w-full">
                <Explorer />
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
                      <div className="bg-black text-green-400  p-2 h-full overflow-y-auto w-full">
                        {/* <ProgressBar /> */}
                        {/* <FlowExample /> */}
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
                    <div className="absolute w-full h-full custom-scrollbar">
                      <ChatArea />
                    </div>{" "}
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
});

EditorUI.displayName = "EditorUI";
export default EditorUI;
