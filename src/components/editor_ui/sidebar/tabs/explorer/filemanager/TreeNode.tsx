import { Tree } from "@/lib/types/type";
import { FaFolder } from "react-icons/fa6";
import { FaFile } from "react-icons/fa";
import { IoIosArrowDropupCircle } from "react-icons/io";
import { memo, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useEditor } from "@/lib/zustand/store";
import { useDebounce, useFocusNode } from "@/lib/hooks/useDebounce";

const TreeNode = memo(
  ({
    node,
    level = 0,
    isExpanded,
    emptyFileId,
    // setDebounceText,
  }: {
    node: Tree;
    level: number;
    isExpanded: boolean;
    emptyFileId: string;
    // setDebounceText: React.Dispatch<React.SetStateAction<string>>;
  }) => {
    const setActivePath = useEditor((s) => s.setClickedFileCurrentPath);
    const currentPath = useEditor((s) => s.clickedFileCurrentPath);
    const project = useEditor((s) => s.project);
    const setFilterFile = useEditor((s) => s.setFilterFile);
    const setOpenFiles = useEditor((s) => s.setOpenFiles);
    const setExpandedStatus = useEditor((s) => s.setExpandedStatus);
    const isLastChild = useMemo(() => {
      return node.children?.length === undefined && level > 0;
    }, [level, node]);

    const [input, setInput] = useState("");
    const debounceText = useDebounce(input, 250);

    const focusRef = useRef<HTMLDivElement | null>(null);
    const executeCreateFile = async () => {
      if (!input) return;
      const result = await window.fsmodule.createFile(
        "",
        currentPath ?? project?.path,
        debounceText,
        "silent",
      );
    };
    const executeCreateFolder = async () => {
      if (!input) return;
      const result = await window.fsmodule.createFolder(
        currentPath + `\\${input}`,
      );
    };

    const focus = useFocusNode(
      focusRef,
      () => {
        // executeCreateFile();
      },
      () => {
        if (!input) {
          if (node.type === "file") {
            setFilterFile(emptyFileId);
          } else if (node.type === "folder") {
            setFilterFile(emptyFileId);
          }
        } else {
          if (node.type === "file") {
            executeCreateFile();
          } else if (node.type === "folder") {
            executeCreateFolder();
          }
        }
      },
    );

    // useEffect(() => {
    //   setDebounceText(debounceText);
    // }, [debounceText]);

    return (
      <div className="w-full flex flex-col">
        <div
          onClick={() => setActivePath(node.path)}
          className={`flex  w-full flex-shrink items-center gap-2 text-white  `}
          style={{
            paddingLeft: `${isLastChild ? level + 5 * 12 : level * 36}px`,
          }}
        >
          {node.children?.length !== undefined && node.type !== "file" && (
            <IoIosArrowDropupCircle
              className={`transition-all ${isExpanded ? "rotate-180" : "rotate-90"}`}
              onClick={() => {
                setExpandedStatus(node.id);
              }}
            />
          )}

          {!node.name ? (
            <div ref={focusRef}>
              <input
                autoFocus
                className="bg-transparent border outline-none pl-2 ring-0 focus:outline-none focus:ring-0"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (node.type === "file") {
                      executeCreateFile();
                    } else if (node.type === "folder") {
                      executeCreateFolder();
                    }
                  }
                }}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
          ) : (
            <div
              className="flex gap-2 items-center"
              onClick={async () => {
                const content = await window.fsmodule.openFile(node.path);
                if (node.type !== "folder") {
                  setOpenFiles({
                    name: node.name,
                    content: content,
                    id: node.id,
                    path: node.path,
                    type: node.type,
                  });
                }
              }}
            >
              <FileType type={node.type} />
              <div>{node.name}</div>
            </div>
          )}
        </div>
        <AnimatePresence>
          {isExpanded &&
            node?.children?.map((child) => (
              <motion.div
                key={child.id}
                initial={{ height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ height: 0, opacity: 0 }}
              >
                <TreeNode
                  node={child}
                  emptyFileId={emptyFileId}
                  level={level + 1}
                  isExpanded={child.isExpanded}
                />
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    );
  },
);
TreeNode.displayName = "TreeNode";

export default TreeNode;

export const FileType = ({ type }: { type: string }) => {
  if (type === "unknown") return <div>null</div>;

  if (type === "file") {
    return <FaFile className="" />;
  }
  if (type === "folder") {
    return <FaFolder />;
  }

  return null;
};
