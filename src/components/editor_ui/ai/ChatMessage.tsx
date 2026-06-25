/* eslint-disable @typescript-eslint/no-explicit-any */
import Accordian from "@/components/custom/accordian";
import { ExtendedMessage } from "@/lib/types/type";
import {
  extractTextContent,
  isAIMessage,
  isHumanMessage,
  isToolMessage,
} from "@/utils";

import { memo, useEffect, useRef } from "react";
import { SubmitOptions } from "node_modules/@langchain/langgraph-sdk/dist/ui/types";
import type { HITLRequest } from "langchain";
import { DiCssdeck } from "react-icons/di";
import MarkDown from "@/components/custom/react_markdown";
import { useEditor } from "@/lib/zustand/store";
import { scrollDown } from "@/helper";
import { FaArrowDown } from "react-icons/fa6";
import ToolResultDisplay from "./ToolResultDisplay";

const ChatMessages = memo(
  ({
    progress,
    messages,
    isLoading,
    interrupt,
    interrupts,
    activeThread,
    submit,
  }: {
    progress?: any;
    messages: ExtendedMessage[];
    isLoading: boolean;
    interrupt: any;
    interrupts: any;
    activeThread: string | null;
    submit: (
      values: Partial<Record<string, unknown>> | null | undefined,
      options?:
        | SubmitOptions<Record<string, unknown>, Record<string, unknown>>
        | undefined,
    ) => Promise<void>;
  }) => {
    const hitlRequest = interrupt?.value as HITLRequest | undefined;
    const rootPath = useEditor((store) => store.project?.path);

    const handleApprove = async () => {
      if (!hitlRequest) return;
      await submit(
        {
          // messages: [{ content: "done", role: "human" }],
          threadId: activeThread,
          interruptResponse: {
            decisions: [{ type: "approve", message: "User approved" }],
          },
          rootPath,
        },
        // {
        //   config: {
        //     configurable: { thread_id: activeThread },
        //   },
        // },
      );
    };

    const handleReject = async () => {
      if (!hitlRequest) return;

      await submit({
        interruptResponse: {
          decisions: [
            {
              type: "reject",
              message: "User reject the approval",
            },
          ],
        },
        threadId: activeThread,
        rootPath,
      });
    };

    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (!isLoading) return;
      scrollDown(scrollRef);
    }, [isLoading, messages]);

    return (
      <>
        {messages.map((msg, messageIndex) => {
          if (typeof msg != "object") return false;

          const lastIndex = messages?.at(-1)?.id;
          let toolCallLastIndex;

          const isToolMsg = isToolMessage(msg);
          const isLastMessage = msg.id === messages.at(-1)?.id;
          const isAiMsg = isAIMessage(msg);
          const textContent = extractTextContent(msg.content);
          const reasoningContent = msg.additional_kwargs?.reasoning_content;
          const toolCallResult = msg.tool_calls;

          if (toolCallResult) {
            toolCallLastIndex = msg.id;
          }

          return (
            <>
              <div key={msg.id || messageIndex} className="px-2 py-1 relative">
                {/* {msg} */}
                <div
                  className={`flex w-full ${
                    isHumanMessage(msg)
                      ? "justify-end"
                      : "justify-start dark:bg-gray-900 text-white "
                  }`}
                >
                  <div
                    className={`rounded-lg  ${
                      isHumanMessage(msg)
                        ? "bg-[#444444] rounded-xl  dark:bg-gray-100 text-white dark:text-gray-900"
                        : " w-full dark:bg-gray-900 text-white "
                    }`}
                  >
                    {/* progression */}
                    {progress &&
                      !isHumanMessage(msg) &&
                      !textContent &&
                      isLastMessage &&
                      isLoading && (
                        // isLoading && (
                        <div
                          className="flex text-gray-300  gap-1 items-center"
                          key={progress.id}
                        >
                          {
                            <>
                              <DiCssdeck size={30} className="animate-spin" />
                              {progress?.message as string}
                            </>
                          }
                        </div>
                      )}

                    {/* Reasoning content */}
                    <div className="">
                      <Accordian
                        visibility={!!reasoningContent}
                        header="Thought Process"
                      >
                        {isAiMsg && reasoningContent && (
                          <MarkDown
                            text={extractTextContent(reasoningContent)}
                          />
                        )}
                      </Accordian>
                    </div>

                    {/* {tool_call}s */}
                    {toolCallLastIndex === msg.id &&
                      Array.isArray(toolCallResult) &&
                      toolCallResult.map((t) => {
                        // if (t.name === "write_todos") return;
                        // return <div key={t.id}>{JSON.stringify(t.args)}</div>;
                        return (
                          <div key={t.id} className="w-full">
                            <Accordian
                              visibility={!!toolCallResult}
                              header={`Tool Call: ${JSON.stringify(t.name)}`}
                            >
                              <div className="px-2">
                                {Object.entries(t.args).map(([key, value]) => (
                                  <tr key={key}>
                                    <td className="px-2 py-1 font-bold">
                                      {key}
                                    </td>
                                    <td className="px-2 py-1">{value}</td>
                                  </tr>
                                ))}
                              </div>
                            </Accordian>
                          </div>
                        );
                      })}

                    {/* interrupt call  */}
                    {!isHumanMessage(msg) &&
                      lastIndex == msg.id &&
                      Array.isArray(interrupts) &&
                      interrupts.map((int) => (
                        <div
                          key={int.id}
                          className="border gap-2 flex  flex-col rounded-2xl p-2 border-blue-500"
                        >
                          <p className="italic">
                            {int.value.actionRequests[0].description}
                          </p>
                          <button
                            className=" bg-green-800 rounded-xl p-2"
                            onClick={() => handleApprove()}
                          >
                            Approve
                          </button>
                          <button
                            className=" bg-red-800 rounded-xl p-2"
                            onClick={() => handleReject()}
                          >
                            Denied
                          </button>
                        </div>
                      ))}
                    {/* final message content */}
                    {isToolMsg ? ( //tool result
                      <Accordian
                        visibility={!!isToolMsg}
                        header={`Tool Result`}
                      >
                        {/* <code className="whitespace-pre-wrap">
                          {textContent}
                        </code>
                         */}
                        {/* {textContent} */}
                        <ToolResultDisplay result={textContent} />
                      </Accordian>
                    ) : (
                      // final resulted message
                      <>
                        {/* // final resulted message */}
                        {/* <code className="whitespace-pre-wrap">
                          {textContent}
                        </code> */}

                        <MarkDown text={textContent} />
                      </>
                    )}
                  </div>
                </div>
                {/* <span className="text-white">
                  {JSON.stringify(msg.response_metadata)}
                </span> */}
                <span className="text-white">
                  {JSON.stringify(msg.usage_metadata?.input_tokens)}
                </span>
              </div>
            </>
          );
        })}
        <button
          onClick={() => scrollDown(scrollRef)}
          aria-label="scroll down"
          className="absolute bg-white  rounded-2xl p-2 text-black bottom-28 transition-all hover:scale-110 left-1/2 -translate-x-6"
        >
          <FaArrowDown />
        </button>
        <div ref={scrollRef}></div>
      </>
    );
  },
);

ChatMessages.displayName = "ChatMessages";

export default ChatMessages;
