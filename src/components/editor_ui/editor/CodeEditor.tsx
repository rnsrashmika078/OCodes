import { useDebounce } from "@/lib/hooks/useDebounce";
import { useEditor } from "@/lib/zustand/store";
import Editor, { loader } from "@monaco-editor/react";
import { useEffect, useState } from "react";

const CodeEditor = () => {
  const activeFile = useEditor((store) => store.activeFile);
  const project = useEditor((store) => store.project);
  const setProject = useEditor((store) => store.setProject);
  const setActiveFile = useEditor((store) => store.setActiveFile);
  const setUpdateActiveFile = useEditor((store) => store.setUpdateActiveFile);
  function getLanguageFromFileName(fileName: string) {
    const ext = fileName.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "ts":
        return "typescript";
      case "tsx":
        return "javascript";
      case "js":
        return "javascript";
      case "json":
        return "json";
      default:
        return "plaintext";
    }
  }
  const [editorCode, setEditorCode] = useState<string>(
    activeFile?.content ?? ""
  );
  const debounceCodeEditorText = useDebounce(editorCode, 300);

  useEffect(() => {
    const saveChanges = async () => {
      await window.fsmodule.saveFile(
        debounceCodeEditorText.toString() ?? "",
        activeFile?.path,
        activeFile?.name
      );
      setUpdateActiveFile(debounceCodeEditorText.toString() ?? "");
      // if (project) {
      //   setProject(await window.fsmodule.refreshProject(project.path));
      // }
    };

    saveChanges();
  }, [debounceCodeEditorText]);

  return (
    <div className="flex flex-[1] h-full w-[calc(100%-0.5rem)]">
      {activeFile && activeFile.content ? (
        <Editor
          onChange={(value) => {
            setEditorCode(value ?? "");
          }}
          height="100%"
          width="100%"
          defaultLanguage={getLanguageFromFileName(activeFile?.name ?? "")}
          value={editorCode}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: "on",
            fontSize: 14,
            automaticLayout: true,
          }}
        />
      ) : (
        <div className="h-full flex flex-col justify-center items-center w-full">
          <header>OCODE</header>
          <sub>AI based code editor</sub>
        </div>
      )}
    </div>
  );
};
export default CodeEditor;
