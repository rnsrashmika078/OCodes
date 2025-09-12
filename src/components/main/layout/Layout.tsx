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

const Layout = () => {
  const height = useChatClone((store) => store.height);
  const [isToggle, setIsToggle] = useState<boolean>(true);
  const [dragWidth, setDragWidth] = useState<number>(300);

  const toggleSidebar = (state?: boolean) => {
    if (state !== undefined) setIsToggle(state);
    else setIsToggle((prev) => !prev);
  };

  return (
    // <div
    //   className={` text-white transition-all  duration-600 w-full flex h-full overflow-hidden`}
    //   // style={{ height: `${height}px` }}
    // >
    //   <div className="flex w-full h-full ">
    //     <div>
    //       <Sidebar toggleSidebar={toggleSidebar} isToggle={isToggle} />
    //     </div>

    //     <div className=" flex  flex-col w-full justify-start items-center h-full">
    //       <div className=" flex flex-col w-full justify-start items-center h-[60px] ">
    //         <Nav toggleSidebar={toggleSidebar} isToggle={isToggle} />
    //       </div>
    //       <div
    //         className="flex z-20 flex-col w-full justify-start items-center custom-scrollbar overflow-x-hidden "
    //         style={{ height: height - 50 }}
    //       >
    //         <ChatArea />

    //         <motion.div className="relative w-full mt-14 z-50">
    //           <AskAI toggleSidebar={toggleSidebar} />
    //         </motion.div>
    //       </div>

    //       {/* <div className=" flex flex-col w-full justify-start items-center ">
    //         <Footer />
    //       </div> */}
    //     </div>
    //   </div>
    // </div>

    <div className="flex flex-col h-full w-full ">
      <div className="flex flex-col w-full h-8 bg-purple-500 "></div>
      <div className="flex w-full h-full ">
        <div
          className={`relative flex bg-blue-500`}
          style={{ width: `${dragWidth}px` }}
        >
          {/* draggable Container */}
          <Splitter setDragWidth={setDragWidth}  max={1000} />

          <div className={`flex bg-gray-900`} style={{ width: "56px" }}></div>
        </div>
        <div className="flex-[2]  w-full ">
          <div className="flex w-full flex-[2] justify-between">
            <TabLayout>
              {[...Array(5)].map((_t, i) => (
                // @ts-expect-error: tab index issue
                <div key={i}></div>
              ))}
            </TabLayout>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
