import { BiDotsHorizontal } from "react-icons/bi";
import FileTreeV2 from "./filemanager/FileTreeV2";

const Explorer = () => {
  return (
    <div className="relative flex flex-col w-full custom-scrollbar-x h-full">
      {/* <div className="px-3 mt-2 flex w-full justify-between items-center sticky top-5 z-[99999] bg-black"> */}
      {/* Header : name of tab */}
      {/* <div className="flex items-center gap-1 p-3"> */}
      {/* <p className="uppercase  leading-none">Explorer</p> */}
      {/* </div> */}
      {/* <BiDotsHorizontal className="text-gray-400" size={18} /> */}
      {/* header ends here */}
      {/* </div> */}
      {/* file manager */}
      <div className="relative h-full  w-full  flex-shrink-0 ">
        <div className="h-full space-y-2 p-2  flex-shrink-0">
          <FileTreeV2 />
        </div>
      </div>
    </div>
  );
};

export default Explorer;
