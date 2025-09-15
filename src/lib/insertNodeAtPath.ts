import { Tree } from "@/types/type";

export function insertNodeAtPath(
  tree: Tree[],
  targetPath: string,
  newNode: Tree
): Tree[] {
  if (!targetPath) {
    return [...tree, newNode];
  }

  return tree.map((node) => {
    if (node.path === targetPath) {
      return {
        ...node,
        children: [...(node.children || []), newNode],
      };
    }

    if (node.children) {
      return {
        ...node,
        children: insertNodeAtPath(node.children, targetPath, newNode),
      };
    }

    return node;
  });
}
