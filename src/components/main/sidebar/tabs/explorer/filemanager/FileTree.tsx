import Button from "@/components/common/Button";
import { FilePath, Tree } from "@/types/type";
import { useChatClone } from "@/zustand/store";
import { useEffect, useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa6";

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
  const setProject = useChatClone((store) => store.setProject);
  const setOpenFiles = useChatClone((store) => store.setOpenFiles);

  const toggle = (idx: number) => {
    setExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleOpen = async (node: Tree) => {
    if (node.type === "file") {
      const content = await window.fsmodule.openFile(node.path);
      console.log("📄 File content:", content);
      if (content) {
        setOpenFiles({ content, node: node });
      }
    }
  };

  return (
    <div className={`space-y-1 px-1`}>
      <div></div>
      {project?.path ? (
        expanded[-2] ? (
          <div className="flex">
            <FaChevronDown
              size={12}
              color="white"
              className="flex-shrink-0 mt-0.5"
              onClick={() => toggle(-2)}
            />
            <h1 className="mx-3 ">{project?.path.split("\\").pop()}</h1>
          </div>
        ) : (
          <div className="flex ">
            <div className="flex items-center">
              <FaChevronRight
                size={12}
                color="white"
                className="flex-shrink-0"
                onClick={() => toggle(-2)}
              />
            </div>
            <h1 className="mx-3">{project?.path.split("\\").pop()}</h1>
          </div>
        )
      ) : (
        <div className="flex flex-col">
          {project === null ? (
            expanded[-1] ? (
              <div className="flex">
                <FaChevronDown
                  size={12}
                  color="white"
                  className="flex-shrink-0 mt-0.5"
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
          <div className="flex justify-center items-center">
            {expanded[-1] && (
              <div className="flex flex-col">
                <h2>You have not yet opened a folder</h2>
                <Button
                  name="Open Folder"
                  onClick={async () =>
                    setProject(await window.fsmodule.pickProject())
                  }
                />
              </div>
            )}
          </div>
        </div>
      )}
      {nodes &&
        !expanded[-2] &&
        nodes.length > 0 &&
        nodes.map((node, idx) => (
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
                console.log("Current CLicked Node", node.path);
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
                  <span className="text-2xl">📂</span>
                </>
              )}
              {node.type === "file" && <span className="text-lg">📄</span>}
              <p>{node.name}</p>
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
