/* eslint-disable @typescript-eslint/no-explicit-any */
import { RefObject } from "react";
import { Tree } from "./lib/types/type";
import { TProjectRead } from "./lib/types/type";
import { FaReact } from "react-icons/fa6";

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
export const removeNodeModulesRecursively = (nodes: Tree[]): Tree[] => {
  return nodes
    .filter((node) => node.name !== "node_modules")
    .map((node) => ({
      ...node,
      children: node.children
        ? removeNodeModulesRecursively(node.children)
        : undefined,
    }));
};

export const scrollDown = (scrollRef: RefObject<HTMLDivElement>) => {
  if (!scrollRef.current) return;
  scrollRef.current?.scrollIntoView({ behavior: "smooth" });
};

export const imageConvert = (file: File | undefined) => {
  if (!file) return;
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
};

export const ExpandTextArea = (
  textareaRef: RefObject<HTMLTextAreaElement>,
  reset?: boolean,
) => {
  if (!textareaRef.current) return;
  textareaRef.current.style.height = "auto";
  const scrollHeight = textareaRef.current.scrollHeight;
  const maxHeight = 200;
  textareaRef.current.style.height =
    Math.min(scrollHeight, reset ? 40 : maxHeight) + "px";

  textareaRef.current.style.overflowY =
    scrollHeight > maxHeight ? "auto" : "hidden";
};
export const fileIcon = (filename: string): any => {
  const ext = filename.split(".").at(-1);
  switch (ext) {
    case "tsx":
      return FaReact;
  }
};
