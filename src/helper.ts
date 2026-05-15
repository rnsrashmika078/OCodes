import { Tree } from "./lib/types/type";

export function RecursiveTreeTraversal(
  nodes: Tree[],
  currentPath: string,
  newFile: Tree,
): Tree[] {
  const result = nodes.map((node) => {
    if (node.path === currentPath) {
      return {
        ...node,
        isExpanded: true,
        children: [...(node.children ?? []), newFile],
      };
    }

    if (node.children) {
      return {
        ...node,
        children: RecursiveTreeTraversal(node.children, currentPath, newFile),
      };
    }
    return node;
  });

  return result;
}
