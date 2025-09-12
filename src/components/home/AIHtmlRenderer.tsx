import { useChatClone } from "@/zustand/store";
import { useState } from "react";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";

const AIHtmlRenderer = () => {
  const [aiHtml, setAiHtml] = useState<string>("");
  const copiedText = useChatClone((store) => store.copiedText);
  console.log(copiedText);

  const code = `<Preview />`; // AI output cleaned

  return (
    <LiveProvider code={code}>
      <LivePreview />
    </LiveProvider>
  );
};

export default AIHtmlRenderer;
