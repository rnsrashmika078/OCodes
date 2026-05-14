import { useEditor } from "@/lib/zustand/store";
import TreeNode from "./TreeNode";
import { Tree } from "@/lib/types/type";
import { VscNewFile } from "react-icons/vsc";
import { VscNewFolder } from "react-icons/vsc";
import { RefreshIcon } from "@codesandbox/sandpack-react";
import { BiRefresh } from "react-icons/bi";

const FileTreeV2 = () => {
  const setProject = useEditor((s) => s.setProject);
  const project = useEditor((s) => s.project);
  return (
    <div className="text-white">
      {/* <input type="file" onChange={}></input> */}
      {!project ? (
        <button
          className="text-white border p-2 text-xs rounded-xl bg-gray-900"
          onClick={async () => {
            const result = await window.fsmodule.pick();
            const prevProject = project;
            if (result.path) {
              setProject(result);
              return;
            }
            setProject(prevProject);
            return;
          }}
        >
          OPEN
        </button>
      ) : (
        <div className="flex justify-between items-center">
          <p>{project?.path.split("\\").pop()}</p>
          <div className="flex gap-2">
            <VscNewFile className="icon" />
            <VscNewFolder className="icon" />
            <BiRefresh className="icon" />
          </div>
        </div>
      )}

      {project?.tree.map((node: Tree) => (
        <TreeNode node={node} key={node.id} level={0} />
      ))}
    </div>
  );
};

export default FileTreeV2;
