/* eslint-disable @typescript-eslint/no-explicit-any */
import Accordian from "@/components/custom/accordian";
import { ExtendedMessage, Tree } from "@/lib/types/type";
import {
  extractTextContent,
  isAIMessage,
  isHumanMessage,
  isToolMessage,
} from "@/utils";

import { memo, useEffect, useMemo, useState } from "react";
import { SubmitOptions } from "node_modules/@langchain/langgraph-sdk/dist/ui/types";
import type { HITLRequest, HITLResponse } from "langchain";
// import { useEditor } from "@/lib/zustand/store";
import { DiCssdeck } from "react-icons/di";
import MarkDown from "@/components/custom/react_markdown";
import { useEditor } from "@/lib/zustand/store";
import { removeNodeModulesRecursively } from "@/helper";

const ChatMessages = memo(
  ({
    // stream
    progress,
    messages,
    isLoading,
    interrupt,
    interrupts,
    submit,
  }: {
    progress: string;
    // stream: BaseStream<Record<string, unknown>, DefaultToolCall, BagTemplate>;
    messages: ExtendedMessage[];
    isLoading: boolean;
    interrupt: any;
    interrupts: any;
    submit: (
      values: Partial<Record<string, unknown>> | null | undefined,
      options?:
        | SubmitOptions<Record<string, unknown>, Record<string, unknown>>
        | undefined,
    ) => Promise<void>;
  }) => {
    console.log("Rendering: ChatMessages.tsx ");
    //only for next js
    const [filteredTree, setFilteredTree] = useState<Tree[] | undefined>(
      undefined,
    );

    console.log("filtered tree from chat messages", filteredTree);
    const hitlRequest = interrupt?.value as HITLRequest | undefined;
    const actionRequests = hitlRequest?.actionRequests ?? [];
    // const reviewConfigs = hitlRequest?.reviewConfigs ?? [];

    const rootPath = useEditor((store) => store.project?.path);
    const fileTree = useEditor((store) => store.project?.tree);

    // const toolCallResult = useMemo(
    //      return "YES"
    //   })
    //   [messages],
    // )

    const toolResult = useMemo(() => {
      messages.map((msg) => {
        if (typeof msg != "object") return null;
        const tool_call_result = msg.tool_calls;
        return tool_call_result;
      });
    }, [messages]);

    const handleApprove = async () => {
      if (!hitlRequest) return;

      await submit({
        interruptResponse: {
          decisions: [{ type: "approve" }],
        },
        threadId: "chat123",
        rootPath,
        fileTree: filteredTree,
      });
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
        threadId: "chat123",
        rootPath,
        fileTree: filteredTree,
      });
    };

    //only for next js
    useEffect(() => {
      if (!fileTree) return;
      const filter = () => {
        if (!fileTree) {
          setFilteredTree([]);
          return;
        }
        const filterTree = removeNodeModulesRecursively(fileTree);
        setFilteredTree(filterTree);
        return filterTree;
      };
      filter();
    }, [fileTree]);

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
          const tool_call_result = msg.tool_calls;

          if (tool_call_result) {
            toolCallLastIndex = msg.id;
          }

          return (
            <>
              <div key={msg.id || messageIndex} className="px-2 py-1 relative">
                {/* Message */}
                {/* Loading spinner */}

                <div
                  className={`flex w-full ${
                    isHumanMessage(msg)
                      ? "justify-end "
                      : "justify-start dark:bg-gray-900 text-white "
                  }`}
                >
                  <div
                    className={`rounded-lg  ${
                      isHumanMessage(msg)
                        ? "bg-gray-900  dark:bg-gray-100 text-white dark:text-gray-900"
                        : " w-full dark:bg-gray-900 text-white "
                    }`}
                  >
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
                      {Array.isArray(tool_call_result) &&
                        !isHumanMessage(msg) &&
                        !textContent &&
                        isLoading && (
                          <div className="flex text-gray-300  gap-1 items-center">
                            {
                              <>
                                <DiCssdeck size={30} className="animate-spin" />
                                {progress}
                              </>
                            }
                          </div>
                        )}
                    </div>

                    {/* {tool_call} */}
                    {toolCallLastIndex === msg.id &&
                      Array.isArray(tool_call_result) &&
                      tool_call_result.map((t) => (
                        <div key={t.id} className="w-full">
                          <Accordian
                            visibility={!!tool_call_result}
                            header={`Tool Call: ${JSON.stringify(t.name)}`}
                          >
                            <div className="px-2">
                              {Object.entries(t.args).map(([key, value]) => (
                                <tr key={key}>
                                  <td className="px-2 py-1 font-bold">{key}</td>
                                  <td className="px-2 py-1">{value}</td>
                                </tr>
                              ))}
                            </div>
                          </Accordian>
                        </div>
                      ))}

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
                        {/* <MarkDown text={textContent} /> */}
                        <pre className="whitespace-pre-wrap">{textContent}</pre>
                      </Accordian>
                    ) : (
                      // final resulted message

                      <MarkDown text={textContent} />
                    )}
                  </div>
                </div>
              </div>
            </>
          );
        })}
      </>
    );
  },
);

ChatMessages.displayName = "ChatMessages";

export default ChatMessages;
