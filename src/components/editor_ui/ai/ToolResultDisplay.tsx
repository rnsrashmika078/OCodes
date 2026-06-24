import { memo } from "react";

const ToolResultDisplay = memo(({ result }: { result: string }) => {
  const parsedData = JSON.parse(result);
  if (!parsedData) return;
  return <code className="px-4 whitespace-pre">{JSON.stringify(parsedData, null, 4)}</code>;
});

ToolResultDisplay.displayName = "ToolResultDisplay";

export default ToolResultDisplay;
