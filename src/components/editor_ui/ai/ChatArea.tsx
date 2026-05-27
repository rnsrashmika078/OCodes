import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { ExtendedMessage, Tree } from "@/lib/types/type";
import { useEditor } from "@/lib/zustand/store";
import {
  FetchStreamTransport,
  useStream,
} from "@langchain/langgraph-sdk/react";
import ChatMessages from "./ChatMessage";
import TextArea from "./TextArea";
const ChatArea = memo(() => {
  const [searchText, setSearchText] = useState("");

  const [progress, setProgress] = useState<string>("");
  const projectTree = useEditor((store) => store.project?.tree);
  const projectPath = useEditor((store) => store.project?.path);
  const cwd = useEditor((store) => store.cwd);
  const [filteredTree, setFilteredTree] = useState<Tree[] | undefined>(
    undefined,
  );

  const handleCustomEvent = useCallback((data: unknown) => {
    setProgress(data as string);
  }, []);

  const transport = useMemo(() => {
    return new FetchStreamTransport({
      // apiUrl: "http://localhost:3000/api/chat",
      apiUrl: "http://localhost:3000/api/chat",
      // apiUrl: "http://localhost:2024",
      // assistantId: "agent",
    });
  }, []);

  // { interrupt, interrupts, messages, submit, isLoading, stop }
  const stream = useStream({
    // transport,
    apiUrl: "http://localhost:2024",
    // apiUrl: "http://localhost:8000/api/chat",
    assistantId: "agent",
    onCustomEvent: handleCustomEvent,
  });

  const formattedMessage = useMemo(() => {
    return stream.messages.map(
      (msg) =>
        ({
          ...msg,
          additional_kwargs: msg.additional_kwargs,
          // invalid_tool_calls: msg.type === "ai" ? msg.invalid_tool_calls : null,
          // tool_calls: msg.type === "ai" ? msg.tool_calls : null,
        }) as ExtendedMessage,
    );
  }, [stream.messages]);

  const removeNodeModulesRecursively = (nodes: Tree[]): Tree[] => {
    return nodes
      .filter((node) => node.name !== "node_modules")
      .map((node) => ({
        ...node,
        children: node.children
          ? removeNodeModulesRecursively(node.children)
          : undefined,
      }));
  };
  useEffect(() => {
    if (!projectTree) return;
    const filter = () => {
      if (!projectTree) {
        setFilteredTree([]);
        return;
      }
      const filterTree = removeNodeModulesRecursively(projectTree);
      setFilteredTree(filterTree);
      return filterTree;
    };
    filter();
  }, [projectTree]);

  console.log("Rendering: ChatArea.tsx ");

  return (
    <div className="flex flex-col justify-between h-full w-full custom-scrollbar">
      <div className="w-full">
        {/* {JSON.stringify(toolCalls[0])} */}

        {formattedMessage && formattedMessage.length > 0 && (
          <ChatMessages
            // stream={stream}
            progress={progress}
            isLoading={stream.isLoading}
            // addToolApprovalResponse={addToolApprovalResponse}
            messages={formattedMessage}
            interrupts={stream.interrupts}
            interrupt={stream.interrupt}
            submit={stream.submit}
            // regenerate={regenerate}
          />
        )}
      </div>
      <div className="p-5 sticky bottom-0">
        <div className="relative">
          <TextArea
            searchText={searchText}
            handleClick={(search) => {
              stream.submit({
                messages: [
                  ...stream.messages,
                  { content: search, role: "human" },
                ],
                rootPath: projectPath,
                cwd,
                fileTree: filteredTree,
                threadId: "chat123",
              });
              setSearchText("");
            }}
            setSearchText={setSearchText}
          />
          <div className="absolute -top-10 -translate-x-1/2 left-1/2">
            {stream.isLoading && (
              <div className=" absolute  flex space-1 -bottom-5 left-1/2 -translate-x-1/2 gap-2 bg-white p-1 rounded-2xl">
                <span className=" w-2 h-2 animate-pulse bg-black rounded-2xl"></span>
                <span className=" w-2 h-2 animate-pulse bg-black rounded-2xl delay-150 "></span>
                <span className=" w-2 h-2 animate-pulse bg-black rounded-2xl delay-300"></span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

ChatArea.displayName = "ChatArea";

export default ChatArea;
