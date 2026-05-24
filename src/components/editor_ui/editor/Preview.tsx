import { useEditor } from "@/lib/zustand/store";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
} from "@codesandbox/sandpack-react";
import { memo, useEffect, useRef, useState } from "react";
type PreviewProps = {
  code: string;
};

// "C:\\Users\\Rashm\\OneDrive\\Desktop\\workspace\\components\\welcome.tsx"

const Preview = memo(({ code }: PreviewProps) => {
  const projectFileReadings = useEditor((store) => store.projectFileReadings);
  const basePath = useEditor((store) =>
    store.project?.path.replace(/\\/g, "/"),
  );
  const project = useEditor((store) => store.project);
  const hasRun = useRef(false);

  const [url, setUrl] = useState<string>("");

  // useEffect(() => {
  //   if (!project?.path) return;
  //   if (hasRun.current) return; // prevent duplicate runs
  //   hasRun.current = true;
  //   console.log("hasRun", hasRun.current);
  //   const runner = async () => {
  //     const res = await window.vite.runViteServer(project?.path);
  //     setUrl(res);
  //     console.log("Resse", res);
  //   };
  //   runner();

  // }, [project?.path]);

  console.log("Paaths", project?.path);

  return (
    <div className=" h-full overflow-y-auto">
      <iframe
        src={`${"http://localhost:5174/"}`}
        className="w-full h-full border-0"
      />
    </div>
  );
});
Preview.displayName = "Preview";

export default Preview;
