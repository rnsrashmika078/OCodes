import { memo } from "react";
import FileTreeV2 from "./filemanager/FileTreeV2";

const Explorer = memo(() => {
  console.log("Rendering: Explorer.tsx ");
  return (
    <div className="relative flex flex-col w-full custom-scrollbar-x h-full">
      <div className="relative h-full  w-full  flex-shrink-0 ">
        <div className="h-full space-y-2 p-2  flex-shrink-0">
          <FileTreeV2 />
        </div>
      </div>
    </div>
  );
});
Explorer.displayName = "Explorer";

export default Explorer;
