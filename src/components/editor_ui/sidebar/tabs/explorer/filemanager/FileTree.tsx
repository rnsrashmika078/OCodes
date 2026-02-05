import Button from "@/components/custom/Button";
import { FilePath, Tree } from "@/lib/types/type";
import { useEditor } from "@/lib/zustand/store";
import { useEffect, useRef, useState } from "react";
import { BsFilePlus } from "react-icons/bs";
import { FaChevronDown, FaChevronRight } from "react-icons/fa6";
import { MdCreateNewFolder, MdOutlineCreateNewFolder } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import { VscNewFile } from "react-icons/vsc";
import { BsFolderPlus } from "react-icons/bs";
import { HiOutlineRefresh } from "react-icons/hi";

export const FileTree = ({
  nodes,
  level = 0,
  project,
}: {
  nodes?: Tree[];
  level?: number;
  project?: FilePath | null;
}) => {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [nodeName, setNodeName] = useState<string>("");
  const setProject = useEditor((store) => store.setProject);
 
  const setClickedFileCurrentPath = useEditor(
    (store) => store.setClickedFileCurrentPath
  );
  const setOpenFiles = useEditor((store) => store.setOpenFiles);
  const clickedFileCurrentPath = useEditor(
    (store) => store.clickedFileCurrentPath
  );

  const toggle = (idx: number) => {
    setExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleOpen = async (node: Tree) => {
    if (node.type === "file") {
      const content = await window.fsmodule.openFile(node.path);
      if (content) {
        setOpenFiles({
          content,
          name: node.name,
          id: node.id,
          path: node.path,
          type: node.type,
        });
      }
    }
  };

  const handleClickIcon = async (iconName: string) => {
    switch (iconName) {
      case "create-new-file": {
        const newNode: Tree = {
          id: uuidv4(),
          name: "untitled.txt",
          type: "txt",
          path: clickedFileCurrentPath ?? project?.path ?? "",
          children: [],
        };
        const result = await window.fsmodule.createFile(
          "",
          newNode.path,
          newNode.name,
          "silent"
        );
        return;
      }
      case "create-new-folder": {
        const newNode: Tree = {
          id: uuidv4(),
          type: "folder",
          name: "New folder",
          path:
            (clickedFileCurrentPath ?? project?.path ?? "") + "\\New Folder",
          children: [],
        };
        const result = await window.fsmodule.createFolder(newNode.path);


        return;
      }
      case "refresh": {
        return;
      }
    }
  };
  const sortedFiles = nodes?.sort((a, b) => {
    if (a.type === "folder" && b.type !== "folder") return -1;
    if (a.type !== "folder" && b.type === "folder") return 1;
    return 0;
  });

  useEffect(() => {
    const unsubscribe = window.electronAPI.onFsChange(async (_event, _data) => {
      if (project?.path) {
        setProject(await window.fsmodule.refreshProject(project.path));
      } else {
        // console.warn("⚠️ No project path set, skipping refresh");
      }
    });
    return () => {
      unsubscribe();
    };
  }, [project]);
  useEffect(() => {
    if (!project) return;
    const update = project.tree.filter((file) => file.name === "" && file);
    // setProject(update);
  }, [project]);
  return (
    <div className={`space-y-1 px-1`}>
      <div></div>
      {/* this is where folder open true */}
      {project?.path ? (
        // folder collapsed
        expanded[-2] ? (
          <div className="flex" onClick={() => toggle(-2)}>
            <FaChevronRight
              size={12}
              color="white"
              className="flex-shrink-0 mt-3"
            />
            <h1 className="mx-2 font-bold ">
              {project?.path.split("\\").pop()}
            </h1>
          </div>
        ) : (
          // folder expanded
          <div className="flex justify-between">
            <div className="flex items-center " onClick={() => toggle(-2)}>
              <FaChevronDown
                size={12}
                color="white"
                className="flex-shrink-0"
              />
              <h1 className="mx-2 font-bold">
                {project?.path.split("\\").pop()}
              </h1>
            </div>
            <div className="flex items-center gap-5">
              <VscNewFile
                color="white"
                className="flex-shrink-0 icon"
                name="create-new-file"
                onClick={() => handleClickIcon("create-new-file")}
              />
              <BsFolderPlus
                color="white"
                className="flex-shrink-0 icon"
                name="create-new-folder"
                onClick={() => handleClickIcon("create-new-folder")}
              />
              <HiOutlineRefresh
                color="white"
                className="flex-shrink-0 icon"
                name="refresh"
                onClick={() => handleClickIcon("refresh")}
              />
            </div>
          </div>
        )
      ) : (
        // this where folder false open
        <div className="flex flex-col">
          {project === null ? (
            expanded[-1] ? (
              <div className="flex">
                <FaChevronDown
                  size={12}
                  color="white"
                  className="flex-shrink-0 mt-2.5"
                  onClick={() => toggle(-1)}
                />
                <h1 className="mx-3 ">NO FOLDER OPEN</h1>
              </div>
            ) : (
              <div className="flex ">
                <div className="flex items-center">
                  <FaChevronRight
                    size={12}
                    color="white"
                    className="flex-shrink-0"
                    onClick={() => toggle(-1)}
                  />
                </div>
                <h1 className="mx-3">NO FOLDER OPEN</h1>
              </div>
            )
          ) : null}

          {/* if not folder open then the child items of that pane */}
          <div className="flex  justify-center items-center flex-shrink-0">
            {expanded[-1] && (
              <div className="flex flex-col mt-2">
                <h2>You have not yet opened a folder</h2>
                <Button
                  className="mt-2 mb-2"
                  name="Open Folder"
                  onClick={async () => setProject(await window.fsmodule.pick())}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {sortedFiles &&
        !expanded[-2] &&
        sortedFiles.length > 0 &&
        sortedFiles.map((node, idx) => (
          <div
            // @ts-expect-error:expect-error-here
            key={idx}
            className="mx-2"
          >
            <div
              className="flex items-center gap-1"
              style={{ paddingLeft: level * 30 }}
              onClick={() => {
                handleOpen(node);
                setClickedFileCurrentPath(node.path);
              }}
            >
              {node.type === "folder" && (
                <>
                  {expanded[idx] ? (
                    <div>
                      <FaChevronDown
                        color="gray"
                        className="flex-shrink-0"
                        onClick={() => {
                          toggle(idx);
                        }}
                      />
                    </div>
                  ) : (
                    <FaChevronRight
                      color="gray"
                      className="flex-shrink-0"
                      onClick={() => toggle(idx)}
                    />
                  )}
                  <span
                    className="text-2xl"
                    onClick={() => {
                      toggle(idx);
                    }}
                  >
                    📂
                  </span>
                </>
              )}
              {node.type === "file" && <span className="text-lg">📄</span>}
              {node.type === "" && <span className="text-lg">❓</span>}

              {["txt", "md"].includes(node.type) && (
                <span className="text-lg">📄</span>
              )}
              {["js", "ts", "tsx"].includes(node.type) && (
                <span className="text-lg">📜</span>
              )}
              {["json"].includes(node.type) && (
                <span className="text-lg">🗂️</span>
              )}
              {["png", "jpg", "jpeg", "gif"].includes(node.type) && (
                <span className="text-lg">🖼️</span>
              )}
              <p
                // ref={isAddingNew === node.path ? editRef : null}
                contentEditable
                suppressContentEditableWarning={true}
                onInput={(e) => setNodeName(e.currentTarget.textContent || "")}
              >
                {node.name}
              </p>
            </div>
            <div>
              {node.children && expanded[idx] && (
                <FileTree nodes={node.children} level={level + 1} />
              )}
            </div>
          </div>
        ))}
    </div>
  );
};
