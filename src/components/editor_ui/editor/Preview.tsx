import { useEditor } from "@/lib/zustand/store";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
} from "@codesandbox/sandpack-react";
import { memo, useEffect } from "react";
type PreviewProps = {
  code: string;
};

// "C:\\Users\\Rashm\\OneDrive\\Desktop\\workspace\\components\\welcome.tsx"

const Preview = memo(({ code }: PreviewProps) => {
  const projectFileReadings = useEditor((store) => store.projectFileReadings);
  const basePath = useEditor((store) =>
    store.project?.path.replace(/\\/g, "/"),
  );

  const contentStructure = projectFileReadings.reduce(
    (acc, pr) => {
      const path = pr.path.replace(/\\/g, "/").split(`${basePath}`)[1];

      if (path) {
        acc[path] = pr.content;
      }

      return acc;
    },
    {} as Record<string, string>,
  );

  return (
    <div className=" h-full overflow-y-auto">
      <SandpackProvider
        template="react-ts"
        style={{ height: "100%", width: "100%" }}
        // customSetup={{
        //   entry: "/index.js",
        //   dependencies: {},
        // }}
        options={{
          externalResources: ["https://cdn.tailwindcss.com"],
        }}
        files={{
          ...contentStructure,
        }}
      >
        <SandpackLayout style={{ height: "100%" }}>
          <SandpackPreview style={{ height: "100%" }} />
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
});
Preview.displayName = "Preview";

export default Preview;
