import { useEditor } from "@/lib/zustand/store";
import React from "react";

const FileTreeV2 = () => {
  const setProject = useEditor((store) => store.setProject);

  return (
    <div>
      {/* <input type="file" onChange={}></input> */}
      <button
        onClick={async () => {
          const result = await window.fsmodule.pick();
          console.log("result", result);
          setProject(result);
        }}
      >
        OPEN
      </button>
    </div>
  );
};

export default FileTreeV2;
