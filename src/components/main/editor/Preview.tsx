import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
} from "@codesandbox/sandpack-react";

type PreviewProps = {
  code: string;
};

const Preview = ({ code }: PreviewProps) => {
  return (
    <div className=" h-full overflow-y-auto">
      <SandpackProvider
        style={{ height: "100%" }}
        template="react"
        files={{
          "/App.js":
            code ||
            "export default function App() { return <h1>Hello 🚀</h1> }",
        }}
      >
        <SandpackLayout style={{ height: "100%" }}>
          <SandpackPreview  />
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
};

export default Preview;
