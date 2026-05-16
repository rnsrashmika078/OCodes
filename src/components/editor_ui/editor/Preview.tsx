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
const Preview = memo(({ code }: PreviewProps) => {
  const projectFileReadings = useEditor((store) => store.projectFileReadings);
  const basePath = useEditor((store) => store.project?.path);

  const contentStructure = projectFileReadings.map((pr) => {
    const path = pr.path.split("\\")[1];

    return path;
  });
  console.log("contentStructure", basePath);
  console.log(
    "contentStructure",
    basePath?.split("C:\\Users\\Rashm\\OneDrive\\Desktop\\")[1],
  );
  console.log("contentStructure", contentStructure);
  // path : content

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
        //         files={{
        //           "/App.js":
        //             code ||
        //             `
        // export default function App() {
        //   return (
        //     <h1 className="bg-red-500 text-white p-4">
        //       Welcome to OCode
        //     </h1>
        //   );
        // }
        //     `,
        //         }}
        files={{
          // "/index.js": `
          // import App from "./App";
          // import "./styles.css";
          // `,
          "/App.tsx": `
import Welcome from "./components/welcome";

export default function App() {
  return <Welcome />;
}
`,
          "/components/welcome.tsx": `
import Test from "./test";

export default function Welcome() {
  return <div>
    <h1 className="bg-red-500 text-black p-4">Hello</h1>;
    <Test/>
  </div> 
}
`,
          "/components/test.tsx": `
export default function Test() {
  return <h1 className="bg-red-500 text-black p-4">TEST ME DADDY</h1>;
}`,
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
