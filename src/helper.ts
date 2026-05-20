import { Tree } from "./lib/types/type";
import { TProjectRead } from "./lib/types/type";

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
export function recursiveTreeSorting(nodes: Tree[]): Tree[] {
  const result = nodes
    .map((node) => ({
      ...node,

      children: node.children ? recursiveTreeSorting(node.children) : [],
    }))
    .sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === "folder" ? -1 : 1;
      }
      return 0;
    });
  return result;
}

export async function readProjectFileContent(tree: Tree[]) {
  if (tree.length === 0) return [];

  const contentArray: TProjectRead[] = [];

  const traverse = async (tree: Tree[]) => {
    for (const node of tree) {
      const result = await window.fsmodule.openFile(node.path);
      const file = {
        name: node.name,
        id: node.id,
        content: result,
        path: node.path,
      };

      if (file.content) {
        contentArray.push(file);
      }

      if (node.children) {
        await traverse(node.children);
      }
    }
  };
  await traverse(tree);

  return contentArray;
}
