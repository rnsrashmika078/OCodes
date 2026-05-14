import { Tree } from "@/lib/types/type";
import { FaFolder } from "react-icons/fa6";
import { FaFile } from "react-icons/fa";
import { IoIosArrowDropupCircle } from "react-icons/io";
import { memo, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const TreeNode = memo(({ node, level = 0 }: { node: Tree; level: number }) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const isLastChild = useMemo(() => {
    return node.children?.length === undefined && level > 0;
  }, [level, node]);

  return (
    <>
      <div
        className={`flex flex-shrink items-center gap-2 text-white `}
        style={{
          paddingLeft: `${isLastChild ? level + 5 * 12 : level * 12}px`,
        }}
      >
        {/* {node.path.split("\\").pop()} */}
        {node.children?.length !== undefined && (
          <IoIosArrowDropupCircle
            className={`transition-all ${expanded ? "rotate-180" : "rotate-90"}`}
            onClick={() => setExpanded((prev) => !prev)}
          />
        )}
        <FileType type={node.type} />
        <p className={`  `}>{node.name}</p>
      </div>
      <AnimatePresence>
        {expanded &&
          node?.children?.map((child) => (
            <motion.div
              key={child.id}
              initial={{ height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ height: 0, opacity: 0 }}
            >
              <TreeNode node={child} level={level + 1} />
            </motion.div>
          ))}
      </AnimatePresence>
    </>
  );
});
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
