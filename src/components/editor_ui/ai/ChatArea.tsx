import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { ExtendedMessage, Tree, TThreads } from "@/lib/types/type";
import { useEditor } from "@/lib/zustand/store";
import {
  FetchStreamTransport,
  useStream,
} from "@langchain/langgraph-sdk/react";
import ChatMessages from "./ChatMessage";
import TextArea from "./TextArea";
import { v4 as uuid } from "uuid";
import { useGlobalContext } from "@/lib/context/GlobalContext";
import { state } from "happy-dom/lib/PropertySymbol.js";

const ChatArea = memo(() => {
  const [searchText, setSearchText] = useState("");

  const { threads } = useGlobalContext();
  const [progress, setProgress] = useState<string>("");
  const projectPath = useEditor((store) => store.project?.path);
  const [openNewThread, setOpenNewThread] = useState<boolean>(false);

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
    onThreadId(threadId) {
      // setTest(threadId);
      console.log("Thread was changed", threadId);
    },
    transport,
    // apiUrl: "http://localhost:2024",
    // assistantId: "agent",
    onCustomEvent: handleCustomEvent,
  });

  console.log("History", stream.history);
  const formattedMessage = useMemo(() => {
    if (openNewThread) return [];
    return stream.messages.map(
      (msg) =>
        ({
          ...msg,
          additional_kwargs: msg.additional_kwargs,
          // invalid_tool_calls: msg.type === "ai" ? msg.invalid_tool_calls : null,
          // tool_calls: msg.type === "ai" ? msg.tool_calls : null,
        }) as ExtendedMessage,
    );
  }, [openNewThread, stream.messages]);

  const [localThreads, setLocalThreads] = useState<TThreads[]>([]);
  const [activeThread, setActiveThread] = useState<string | null>(null);

  return (
    <div className="flex flex-col justify-between h-full w-full custom-scrollbar text-xs">
      <div className="block  p-5 gap-2 text-white w-full ">
        {[...(threads ?? []), ...(localThreads ?? [])].flat().map((t) => {
          return (
            <span
              className="border p-2 border-white rounded-xl hover:scale-105 transition-all cursor-pointer"
              key={t.threadId}
              onClick={() => {
                setOpenNewThread(true);
                setActiveThread(t.threadId);
                stream.switchThread(t.threadId);
              }}
            >
              {t.threadId}
            </span>
          );
        })}
      </div>
      <div className="w-full">
        {formattedMessage && formattedMessage.length > 0 && (
          <ChatMessages
            // stream={stream}
            progress={progress}
            // newThreadId={newThreadId.at(-1) ?? ""}
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
            stop={stream.stop}
            startNewThead={() => {
              const id = uuid();
              setActiveThread(id);
              setOpenNewThread(true);
              setLocalThreads((prev) => [...prev, { threadId: id }]);
              stream.switchThread(null);
            }}
            isStreaming={stream.isLoading}
            searchText={searchText}
            handleClick={(search) => {
              const id = uuid();
              if (!activeThread) {
                console.log("no thread yet", activeThread);
                console.log("Initialing new thread", activeThread);
                setActiveThread(id);
                setLocalThreads((prev) => [...prev, { threadId: id }]);
                // stream.switchThread(null);
              }
              setOpenNewThread(false);

              stream.submit({
                messages: [{ content: search, role: "human" }],
                rootPath: projectPath,
                threadId: activeThread ?? id,
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
