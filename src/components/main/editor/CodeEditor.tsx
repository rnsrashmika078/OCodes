import { useChatClone } from "@/zustand/store";
import Editor, { loader } from "@monaco-editor/react";
import { useEffect } from "react";

const CodeEditor = () => {
  const activeFile = useChatClone((store) => store.activeFile);
  const setActiveFile = useChatClone((store) => store.setActiveFile);
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
  useEffect(() => {
    const loadReactTypes = async () => {
      const monacoInstance = await loader.init();
      const tsDefaults = monacoInstance.languages.typescript.typescriptDefaults;

      // tsDefaults.setCompilerOptions({
      //   target: monacoInstance.languages.typescript.ScriptTarget.ES2020,
      //   jsx: monacoInstance.languages.typescript.JsxEmit.React,
      //   module: monacoInstance.languages.typescript.ModuleKind.ESNext,
      //   moduleResolution:
      //     monacoInstance.languages.typescript.ModuleResolutionKind.NodeJs,
      //   allowNonTsExtensions: true,
      //   esModuleInterop: true,
      //   noEmit: true,
      //   baseUrl: "file:///", // root path
      //   paths: {
      //     react: ["file:///node_modules/@types/react/index.d.ts"],
      //     "react-dom": ["file:///node_modules/@types/react-dom/index.d.ts"],
      //   },
      // });
      tsDefaults.setCompilerOptions({
        jsx: monacoInstance.languages.typescript.JsxEmit.React,
        module: monacoInstance.languages.typescript.ModuleKind.ESNext,
        allowNonTsExtensions: true,
        esModuleInterop: true,
        skipLibCheck: true, // 👈 ignore type errors from .d.ts files
        noEmit: true,
      });

      // Fetch React types from public
      const reactRes = await fetch("/types/react/index.d.ts");
      const reactDomRes = await fetch("/types/react-dom/index.d.ts");
      const reactCode = await reactRes.text();
      const reactDomCode = await reactDomRes.text();

      tsDefaults.addExtraLib(
        reactCode,
        "file:///node_modules/@types/react/index.d.ts"
      );
      tsDefaults.addExtraLib(
        reactDomCode,
        "file:///node_modules/@types/react-dom/index.d.ts"
      );
    };

    loadReactTypes();
  }, []);

  return (
    <div className="flex flex-[1] h-full w-[calc(99.5%)]">
      {activeFile && activeFile.content ? (
        <Editor
          onChange={(value) =>
            setActiveFile({ ...activeFile, content: value ?? "" })
          }
          height="100%" // 👈 fill parent height
          width="100%" // 👈 fill parent width
          defaultLanguage={getLanguageFromFileName(activeFile?.name ?? "")}
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
