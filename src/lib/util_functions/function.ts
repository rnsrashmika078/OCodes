import { useEditor } from "../zustand/store";
import { v4 as uuidv4 } from "uuid";

export const Tabfunctions = async (subElement: string) => {
  switch (subElement) {
    case "New File": {
      useEditor.getState().setCreateFile({
        id: uuidv4(),
        content: "Press Ctrl + I to Open the AI. Otherwise type your own",
        name: "",
        path: "",
        type: "",
      });
      break;
    }
    case "Save": {
      const result = await window.fsmodule.createFile(
        useEditor.getState().activeFile?.content,
        "",
        useEditor.getState().activeFile?.name
      );
      // if (result) {
      //   const updatedFile = {
      //     id: activeFile?.id ?? "",
      //     content: activeFile?.content ?? "",
      //     name: result.name ?? "",
      //     path: result.filePath ?? "",
      //     type: result.type ?? "",
      //   };
      //   setUpdateOpenFiles(updatedFile);
      // setUpdateProjectFile(updatedFile);
      // }
      break;
    }
    case "Open": {
      useEditor.getState().setProject(await window.fsmodule.pick());
      break;
    }
    default:
      break;
  }
};
