import { memo, useRef, useState } from "react";
type PreviewProps = {
  code: string;
};

const Preview = memo(({ code }: PreviewProps) => {
  return (
    <div className=" h-full overflow-y-auto">
      <iframe
        // src={`${"http://localhost:5174/"}`}
        className="w-full h-full border-0"
      />
    </div>
  );
});
Preview.displayName = "Preview";

export default Preview;
