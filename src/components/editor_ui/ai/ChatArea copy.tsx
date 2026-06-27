/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useCallback, useMemo, useRef, useState } from "react";
import {
  ExtendedMessage,
  OpenFile,
  TThreads,
  TToolEvent,
} from "@/lib/types/type";
import { useEditor } from "@/lib/zustand/store";
import {
  FetchStreamTransport,
  useStream,
} from "@langchain/langgraph-sdk/react";
import ChatMessages from "./ChatMessage";

import { v4 as uuid } from "uuid";
import { useGlobalContext } from "@/lib/context/GlobalContext";
import z from "zod/v4";
import { useCodingEditor } from "@/lib/zustand/coding_store";

import TextAreaV2 from "./TextAreaV2";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import { TextAreaContextProvider } from "@/lib/context/TextAreaContext";
import { FaStop } from "react-icons/fa6";
import { MdOutlinePostAdd } from "react-icons/md";
import { BsPlus } from "react-icons/bs";

const ChatArea = memo(() => {
  const { threads } = useGlobalContext();
  const [progress, setProgress] = useState<string>("");
  const projectPath = useEditor((store) => store.project?.path);
  const refreshServer = useEditor((store) => store.refreshServer);
  const [openNewThread, setOpenNewThread] = useState<boolean>(false);

  const [localThreads, setLocalThreads] = useState<TThreads[]>([]);
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const handleCustomEvent = useCallback((data: any) => {
    setProgress(data.message as string);
  }, []);

  const transport = useMemo(() => {
    return new FetchStreamTransport({
      apiUrl: "http://localhost:3000/api/chat",
    });
  }, []);

  const ToolResponseSchema = z.object({
    command: z.string(),
  });

  const stream = useStream({
    transport,
    onFinish() {
      setProgress("");
    },

    threadId: activeThread,
    onToolEvent: (toolEvent) => {
      try {
        const toolEventData = toolEvent as TToolEvent;
        if (toolEventData.name === "ShellCommandExecutor") {
          if (toolEventData?.output?.content) {
            const content = toolEventData?.output?.content;
            const parsedResult = ToolResponseSchema.safeParse(
              JSON.parse(content),
            );
            const command = parsedResult.data?.command;
            window.terminal.send(command ?? "");
            window.terminal.send("\r");
            refreshServer();
          }
        }
      } catch (e) {
        console.log("Error handling tool event", e);
      }
    },
    onCustomEvent: handleCustomEvent,
  });

  const formattedMessage = useMemo(() => {
    const messages = stream.messages as ExtendedMessage[];

    return messages;
  }, [stream.messages]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  // const [base, setBase] = useState<unknown>("");
  // const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];

  //   if (!file) return;
  //   const base = await imageConvert(file);
  //   setBase(base);
  //   console.log("base", base);
  // };
  const error = useCodingEditor((store) => store.projectError);
  const activeFile = useEditor((store) => store.activeFile);

  const handleSubmit = async (content: string) => {
    const id = uuid();
    if (!activeThread) {
      setActiveThread(id);
      setLocalThreads((prev) => [...prev, { thread_id: id }]);
      // stream.switchThread(null);
    }
    setOpenNewThread(false);
    try {
      await stream.submit(
        {
          messages: [{ content, role: "human" }],
          rootPath: projectPath,
          threadId: activeThread ?? id,
          error,
          referenceFile: activeFile,
        },
        {
          config: {
            configurable: { thread_id: activeThread ?? id },
          },
        },
      );
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <TextAreaContextProvider>
      <div className="flex flex-col justify-between h-full w-full custom-scrollbar text-xs">
        {/* <div className="block  p-5 gap-2 text-white w-full ">
        {[...(threads ?? []), ...(localThreads ?? [])].flat().map((t) => {
          return (
            <span
              className="border p-2 border-white rounded-xl hover:scale-105 transition-all cursor-pointer"
              key={t.thread_id}
              onClick={async () => {
                setOpenNewThread(true);
                setActiveThread(t.thread_id);

                try {
                  await stream.switchThread(t.thread_id);
                } catch (e) {
                  //silent the stream undefinde isue..
                }
              }}
            >
              {t.thread_id}
            </span>
          );
        })}
      </div> */}
        {/* <ErrorBoundary> */}
        <div className="w-full">
          {true ? (
            formattedMessage &&
            formattedMessage.length > 0 && (
              <ChatMessages
                stream={stream}
                progress={progress}
                activeThread={activeThread}
                isLoading={stream.isLoading}
                messages={formattedMessage}
                interrupts={stream.interrupts}
                interrupt={stream.interrupt}
                submit={stream.submit}
              />
            )
          ) : (
            <div>THREAD IS LOADING...PLEASE WAIT </div>
          )}
        </div>
        {/* </ErrorBoundary> */}

        <div className="p-5 sticky bottom-0">
          <input
            ref={inputRef}
            type="file"
            // onChange={(e) => handleFileUpload(e)}
            className=" pointer-events-none hidden"
          ></input>
          <div className="relative">
            <TextAreaV2
              submit={(content) => handleSubmit(content)}
              // stop={stream.stop}
              // onFileUpload={() => {
              //   if (!inputRef.current) return;
              //   inputRef.current.click();

              //   const files = inputRef.current.files?.[0];
              // }}
              // startNewThead={() => {
              //   const id = uuid();
              //   setActiveThread(id);
              //   setOpenNewThread(true);
              //   setLocalThreads((prev) => [...prev, { thread_id: id }]);
              //   stream.switchThread(null);
              // }}
              // isStreaming={stream.isLoading}
              // searchText={searchText}
              // handleClick={async (search) => {
              //   handleSubmit(search);
              // }}
              // onkeydown={(content) => {
              //   handleSubmit(content);
              // }}
              // setSearchText={setSearchText}
            >
              <div className="flex">
                <button
                  aria-label="files_attachment"
                  className="p-2 icon disabled:text-gray-500 disabled:bg-transparent"
                >
                  <BsPlus
                    size={18}
                    // onClick={() => onFileUpload && onFileUpload()}
                  />
                </button>
                <button
                  aria-label="new_thread"
                  // onClick={() => startNewThead && startNewThead()}
                  className="p-2 icon disabled:text-gray-500 disabled:bg-transparent"
                >
                  <MdOutlinePostAdd size={18} />
                </button>
              </div>

              {!stream.isLoading ? (
                <button
                  aria-label="submit button"
                  disabled={stream.isLoading}
                  type={"submit"}
                  className="p-2 icon disabled:text-gray-500 disabled:bg-transparent"
                >
                  <ArrowUpIcon />
                </button>
              ) : (
                <button
                  aria-label="submit button"
                  type={"button"}
                  onClick={() => {
                    stream.stop();
                  }}
                  className="p-1 icon disabled:text-gray-500 disabled:bg-transparent"
                >
                  <FaStop />
                </button>
              )}
            </TextAreaV2>
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
    </TextAreaContextProvider>
  );
});

ChatArea.displayName = "ChatArea";

export default ChatArea;
