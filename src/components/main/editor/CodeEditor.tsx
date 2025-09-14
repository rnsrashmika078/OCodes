import { OpenFile, Tabs } from "@/types/type";
import Editor from "@monaco-editor/react";
interface CodeEditorProps {
  activeTab: Tabs;
}
const CodeEditor = ({ activeTab }: CodeEditorProps) => {
  return (
    <div className="flex flex-[1] h-full w-[calc(99.5%)]">
      {/* Container must be flex-1 to fill space */}
      <Editor
        height="100%" // 👈 fill parent height
        width="100%" // 👈 fill parent width
        defaultLanguage="javascript"
        value={activeTab?.content || "// empty file"}
        theme="vs-dark"
        options={{
          minimap: { enabled: false }, // hide minimap
          scrollBeyondLastLine: false, // cleaner UX
          wordWrap: "on", // wrap long lines
          fontSize: 14,
          automaticLayout: true, // 👈 makes it responsive
        }}
      />
    </div>
  );
};

export default CodeEditor;
