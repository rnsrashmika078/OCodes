import { useChatClone } from "@/zustand/store";
import Editor from "@monaco-editor/react";

const CodeEditor = () => {
  const activeFile = useChatClone((store) => store.activeFile);
  const setActiveFile = useChatClone((store) => store.setActiveFile);

  return (
    <div className="flex flex-[1] h-full w-[calc(99.5%)]">
      {activeFile && activeFile.content ? (
        <Editor
          onChange={(value) =>
            setActiveFile({ ...activeFile, content: value ?? "" })
          }
          height="100%" // 👈 fill parent height
          width="100%" // 👈 fill parent width
          defaultLanguage="javascript"
          value={(activeFile && activeFile.content) || "// empty file"}
          theme="vs-dark"
          options={{
            minimap: { enabled: false }, // hide minimap
            scrollBeyondLastLine: false, // cleaner UX
            wordWrap: "on", // wrap long lines
            fontSize: 14,
            automaticLayout: true, // 👈 makes it responsive
          }}
        />
      ) : (
        <div className="h-full flex flex-col justify-center items-center w-full">
          <header>OCODE</header>
          <sub>AI based code editor</sub>
        </div>
      )}
      {/* Container must be flex-1 to fill space */}
    </div>
  );
};

export default CodeEditor;
