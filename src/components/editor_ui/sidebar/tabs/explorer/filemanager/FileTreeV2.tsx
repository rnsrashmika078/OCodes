import { useEditor } from "@/lib/zustand/store";
import TreeNode from "./TreeNode";
import { Tree } from "@/lib/types/type";
import { VscNewFile } from "react-icons/vsc";
import { VscNewFolder } from "react-icons/vsc";
import { BiRefresh } from "react-icons/bi";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { RecursiveTreeTraversal } from "@/helper";

const FileTreeV2 = () => {
  const setProject = useEditor((s) => s.setProject);

  const project = useEditor((s) => s.project);
  const currentPath = useEditor((s) => s.clickedFileCurrentPath);

  //file watcher ---> listening to evenry changes of the root directory / open directory
  useEffect(() => {
    console.log("project is changed!");
    const unsubscribe = window.electronAPI.onFsChange(async (_event, _data) => {
      if (project?.path) {
        const prev = project;
        setProject(await window.fsmodule.refreshProject(project.path));
        // setProject(prev);/
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const [debounceText, setDebounceText] = useState("");

  const executeCreateFile = async () => {
    if (debounceText) {
      console.log("creatin file");
      const result = await window.fsmodule.createFile(
        "",
        currentPath ?? "",
        debounceText,
        "silent",
      );
    }
  };

  useEffect(() => {
    executeCreateFile();
  }, [debounceText]);
  return (
    <div className="text-white">
      {currentPath}
      {!project ? (
        <button
          className="text-white border p-2 text-xs rounded-xl bg-gray-900"
          onClick={async () => {
            const result = await window.fsmodule.pick();
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
        <div className="flex justify-between items-center">
          <p>{project?.path.split("\\").pop()}</p>
          <div className="flex gap-2">
            <VscNewFile
              className="icon"
              onClick={async () => {
                const emptyFileId = uuid();
                const emptyFile: Tree = {
                  isExpanded: false,
                  name: "",
                  path: currentPath ?? "",
                  id: emptyFileId,
                  type: "file",
                  children: [],
                };
                setProject({
                  ...project,
                  tree: RecursiveTreeTraversal(
                    project.tree,
                    currentPath ?? "",
                    emptyFile,
                  ),
                });
              }}
            />
            <VscNewFolder
              className="icon"
              onClick={async () => {
                const result = await window.fsmodule.createFolder(
                  currentPath + "/new folder",
                );
              }}
            />
            <BiRefresh className="icon" />
          </div>
        </div>
      )}

      {project?.tree.map((node: Tree) => (
        <TreeNode
          node={node}
          key={node.id}
          level={0}
          isExpanded={node.isExpanded}
          setDebounceText={setDebounceText}
        />
      ))}
    </div>
  );
};

export default FileTreeV2;
