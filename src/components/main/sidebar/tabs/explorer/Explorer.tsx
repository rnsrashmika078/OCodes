import { BiDotsHorizontal } from "react-icons/bi";
import { FileTree } from "./filemanager/FileTree";

import { useChatClone } from "@/zustand/store";

const Explorer = () => {
  const project = useChatClone((store) => store.project);
  console.log(project);

  return (
    <div className="relative flex flex-col w-full custom-scrollbar-x h-full">
      <div className="px-3 mt-2 flex w-full justify-between items-center">
        {/* Header : name of tab */}
        <div className="flex items-center gap-1 p-3">
          <p className="uppercase  leading-none">Explorer</p>
        </div>
        <BiDotsHorizontal className="text-gray-400" size={18} />
        {/* header ends here */}
      </div>
      {/* file manager */}
      <div className="relative h-full custom-scrollbar-y">
        <div className="h-[500px] space-y-2 p-2">
          <FileTree nodes={project?.tree} project={project} />
        </div>
      </div>
    </div>
  );
};

export default Explorer;
