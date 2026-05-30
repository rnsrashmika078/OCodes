import { useEditor } from "@/lib/zustand/store";
import TreeNode from "./TreeNode";
import { Tree } from "@/lib/types/type";
import { VscNewFile } from "react-icons/vsc";
import { VscNewFolder } from "react-icons/vsc";
import { BiRefresh } from "react-icons/bi";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import {
  readProjectFileContent,
  recursiveTreeSorting,
  RecursiveTreeTraversal,
} from "@/helper";

const FileTreeV2 = () => {
  const setProject = useEditor((s) => s.setProject);
  const setCurrentPath = useEditor((s) => s.setClickedFileCurrentPath);
  const setCWD = useEditor((s) => s.setCurrentWorkingDirectory);
  const project = useEditor((s) => s.project);
  const currentPath = useEditor((s) => s.clickedFileCurrentPath);

  const [emptyFileId, setEmptyFileId] = useState<string>("");

  useEffect(() => {
    const unsubscribe = window.electronAPI.onFsChange(async (_event, _data) => {
      if (project?.path) {
        console.log("FleTreeV2  UseEffect");
        setCurrentPath(project.path);
        setProject(await window.fsmodule.refreshProject(project.path));
      }
    });
    return () => {
      unsubscribe();
    };
  }, [project?.tree]);

  const filteredProjectStructure = useMemo(() => {
    const sorted = recursiveTreeSorting(project?.tree ?? []);

    const rebuildTree = (nodes: Tree[]): Tree[] => {
      return nodes.map((node) => ({
        ...node,
        isExpanded: node.isExpanded,
        children: node.children ? rebuildTree(node.children) : [],
      }));
    };
    return rebuildTree(sorted);
  }, [project]);

  // console.log("File Tree v2 is rendering..");
  return (
    <div className="text-white w-full">
      {!project ? (
        <button
          className="text-white border p-2 text-xs rounded-xl bg-gray-900"
          onClick={async () => {
            const result = await window.fsmodule.pick();
            setCWD(result.path);
            if (!result) return;
            const prevProject = project;
            if (result.path) {
              setProject(result);
              return;
            }
            setProject(prevProject);
          }}
        >
          OPEN
        </button>
      ) : (
        <div className="w-full flex justify-between items-center sticky top-6 p-2 bg-black z-[999]  rounded-t-2xl">
          <p
            onClick={() => {
              setCurrentPath(project?.path ?? "");
            }}
          >
            {project?.path.split("\\").pop()}
          </p>
          <div className="flex gap-2">
            <VscNewFile
              className="icon"
              onClick={async () => {
                const emptyFileId = uuid();
                const emptyFile: Tree = {
                  isExpanded: false,
                  name: "",
                  path: project.path ?? currentPath,
                  id: emptyFileId,
                  type: "file",
                  children: [],
                };
                setEmptyFileId(emptyFileId);

                if (currentPath === project.path) {
                  setProject({
                    ...project,
                    tree: [...project.tree, emptyFile],
                  });
                } else {
                  setProject({
                    ...project,
                    tree: RecursiveTreeTraversal(
                      project.tree,
                      currentPath ?? project.path,
                      emptyFile,
                    ),
                  });
                }
              }}
            />
            <VscNewFolder
              className="icon"
              onClick={async () => {
                const emptyFileId = uuid();
                const emptyFile: Tree = {
                  isExpanded: false,
                  name: "",
                  path: project.path ?? currentPath,
                  id: emptyFileId,
                  type: "folder",
                  children: [],
                };

                setEmptyFileId(emptyFileId);
                if (currentPath === project.path) {
                  setProject({
                    ...project,
                    tree: [...project.tree, emptyFile],
                  });
                } else {
                  setProject({
                    ...project,
                    tree: RecursiveTreeTraversal(
                      project.tree,
                      currentPath ?? project?.path,
                      emptyFile,
                    ),
                  });
                }
              }}
            />
            <BiRefresh
              className="icon"
              onClick={async () => {
                const arr = await readProjectFileContent(project.tree);
              }}
            />
          </div>
        </div>
      )}
      <div className=" custom-scrollbar-y h-[600px] w-full mt-8">
        {filteredProjectStructure?.map((node: Tree) => (
          <TreeNode
            node={node}
            key={node.id}
            level={0}
            isExpanded={node.isExpanded}
            emptyFileId={emptyFileId}
          />
        ))}
      </div>
    </div>
  );
};

export default FileTreeV2;
