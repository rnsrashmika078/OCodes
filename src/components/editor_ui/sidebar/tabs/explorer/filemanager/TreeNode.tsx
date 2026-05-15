import { Tree } from "@/lib/types/type";
import { FaFolder } from "react-icons/fa6";
import { FaFile } from "react-icons/fa";
import { IoIosArrowDropupCircle } from "react-icons/io";
import { memo, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useEditor } from "@/lib/zustand/store";
import { useDebounce } from "@/lib/hooks/useDebounce";

const TreeNode = memo(
  ({
    node,
    level = 0,
    isExpanded,
    setDebounceText,
  }: {
    node: Tree;
    level: number;
    isExpanded: boolean;
    setDebounceText: React.Dispatch<React.SetStateAction<string>>;
  }) => {
    const setActivePath = useEditor((s) => s.setClickedFileCurrentPath);
    const currentPath = useEditor((s) => s.clickedFileCurrentPath);
    const setExpandedStatus = useEditor((s) => s.setExpandedStatus);
    const isLastChild = useMemo(() => {
      return node.children?.length === undefined && level > 0;
    }, [level, node]);

    const [input, setInput] = useState("");
    const debounceText = useDebounce(input, 250);

    // const createFile = async () => {
    //   const result = await window.fsmodule.createFile(
    //     "",
    //     currentPath ?? "",
    //     "newfile",
    //     "silent",
    //   );
    // };

    useEffect(() => {
      setDebounceText(debounceText);
    }, [debounceText]);
    return (
      <>
        <div
          onClick={() => setActivePath(node.path)}
          className={`flex flex-shrink items-center gap-2 text-white `}
          style={{
            paddingLeft: `${isLastChild ? level + 5 * 12 : level * 12}px`,
          }}
        >
          {node.children?.length !== undefined && (
            <IoIosArrowDropupCircle
              className={`transition-all ${isExpanded ? "rotate-180" : "rotate-90"}`}
              onClick={() => {
                setExpandedStatus(node.id);
              }}
            />
          )}
          <FileType type={node.type} />

          <p>
            {!node.name ? (
              <input
                className="bg-transparent"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            ) : (
              node.name
            )}
          </p>
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
                  level={level + 1}
                  isExpanded={child.isExpanded}
                  setDebounceText={setDebounceText}
                />
              </motion.div>
            ))}
        </AnimatePresence>
      </>
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
