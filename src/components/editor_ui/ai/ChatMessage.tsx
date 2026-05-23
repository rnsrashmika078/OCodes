/* eslint-disable @typescript-eslint/no-explicit-any */
import Accordian from "@/components/custom/accordian";
import { ExtendedMessage } from "@/lib/types/type";
import {
  extractTextContent,
  isAIMessage,
  isHumanMessage,
  isToolMessage,
} from "@/utils";
import ReactMarkdown from "react-markdown";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import * as prismaStyles from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import { memo, useMemo } from "react";
import { SubmitOptions } from "node_modules/@langchain/langgraph-sdk/dist/ui/types";
import type { HITLRequest, HITLResponse } from "langchain";
import { BaseStream, DefaultToolCall } from "@langchain/langgraph-sdk/react";
import { BagTemplate } from "node_modules/@langchain/langgraph-sdk/dist/types.template";
import { useEditor } from "@/lib/zustand/store";

const ChatMessages = memo(
  ({
    stream,
    messages,
    isLoading,
    interrupt,
    interrupts,
    submit,
  }: {
    stream: BaseStream<Record<string, unknown>, DefaultToolCall, BagTemplate>;
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
    const hitlRequest = interrupt?.value as HITLRequest | undefined;
    const actionRequests = hitlRequest?.actionRequests ?? [];
    const reviewConfigs = hitlRequest?.reviewConfigs ?? [];
    console.log("is array", Array.isArray(interrupts));
    console.log("hitlRequest", hitlRequest);
    console.log("interrupt", interrupt);

    const project = useEditor((store) => store.project);

    // const toolCallResult = useMemo(
    //      return "YES"
    //   })
    //   [messages],
    // )

    const toolResult = useMemo(() => {
      messages.map((msg) => {
        if (typeof msg != "object") return null;
        const tool_call_result = msg.tool_calls;
        console.log("tool result from mapper", tool_call_result);
        return tool_call_result;
      });
    }, [messages]);

    console.log("toot result", toolResult);
    const handleApprove = async () => {
      if (!hitlRequest) return;

      await submit({
        interruptResponse: {
          decisions: [{ type: "approve" }],
        },
        threadId: "chat123", // Maintain ID
      });
    };
    return (
      <>
        {messages.map((msg, messageIndex) => {
          if (typeof msg != "object") return false;

          const lastIndex = messages?.at(-1)?.id;
          console.log("status", msg.status);

          const isToolMsg = isToolMessage(msg);
          const isAiMsg = isAIMessage(msg);
          const textContent = extractTextContent(msg.content);
          const reasoningContent = msg.additional_kwargs?.reasoning_content;
          const tool_call_result = msg.tool_calls;

          return (
            <div key={msg.id || messageIndex} className="p-2">
              {/* Message */}
              {/* Loading spinner */}

              {isLoading && isAiMsg && lastIndex == msg.id && (
                // <div className="px-4 py-2 bg-gray-200 rounded-2xl w-fit animate-pulse"></div>
                <div className="mb-2 w-fit px-2 py-2 animate-pulse bg-gray-50 rounded-2xl "></div>
              )}
              <div
                className={`flex w-full ${
                  isHumanMessage(msg)
                    ? "justify-end "
                    : "justify-start dark:bg-gray-900 text-white bg-gray-800"
                }`}
              >
                <div
                  className={`rounded-lg px-4  py-3 ${
                    isHumanMessage(msg)
                      ? "bg-gray-900  dark:bg-gray-100 text-white dark:text-gray-900"
                      : " w-full dark:bg-gray-900 text-white bg-gray-800"
                  }`}
                >
                  {/* Reasoning content */}
                  <Accordian
                    visibility={!!reasoningContent}
                    header="Thought Process"
                  >
                    {isAiMsg && reasoningContent && (
                      <ReactMarkdown>
                        {extractTextContent(reasoningContent)}
                      </ReactMarkdown>
                    )}
                  </Accordian>

                  {/* {tool_call_result} */}
                  {Array.isArray(tool_call_result) &&
                    tool_call_result.map((t, idx) => (
                      <div key={t.id} className="w-full">
                        <Accordian
                          visibility={!!tool_call_result}
                          header={`Tool Call: ${t.name.toUpperCase()}`}
                        >
                          <code>{JSON.stringify(t)}</code>
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
                        <p className="italic">{int.value.actionRequests[0].description}</p>
                        <button
                          className=" bg-green-800 rounded-xl p-2"
                          onClick={() => handleApprove()}
                        >
                          Approve
                        </button>
                        <button
                          className=" bg-red-800 rounded-xl p-2"
                          onClick={() => handleApprove()}
                        >
                          Denied
                        </button>
                      </div>
                    ))}
                  {/* final message content */}
                  {isToolMsg ? ( //tool result
                    <div className="whitespace-pre-wrap">
                      <Accordian
                        visibility={!!isToolMsg}
                        header={`Tool Result`}
                      >
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ children }) => (
                              <p className="leading-relaxed m-2">{children}</p>
                            ),

                            h1: ({ children }) => (
                              <h1 className="text-2xl font-bold">{children}</h1>
                            ),

                            h2: ({ children }) => (
                              <h2 className="text-xl font-semibold">
                                {children}
                              </h2>
                            ),

                            h3: ({ children }) => (
                              <h3 className="text-lg font-semibold mt-2">
                                {children}
                              </h3>
                            ),
                            h4: ({ children }) => (
                              <h4 className="text-lg font-semibold mt-2">
                                {children}
                              </h4>
                            ),

                            strong: ({ children }) => (
                              <strong className="font-bold ">{children}</strong>
                            ),
                            // em: ({ children }) => (
                            //   <div className="border-l-4 rounded-md px-2 mt-2 bg-textarea">
                            //     <em className="italic text-blue-500">
                            //       {children}
                            //     </em>
                            //   </div>
                            // ),
                            table: ({ children }) => (
                              <table border={1} className=" mt-5 mb-5">
                                {children}
                              </table>
                            ),
                            th: ({ children }) => (
                              <th className=" border-blue-500 px-0 bg-white text-black">
                                {children}
                              </th>
                            ),
                            tr: ({ children }) => (
                              <tr className=" border-blue-500  px-0 md:p-3">
                                {children}
                              </tr>
                            ),
                            td: ({ children }) => (
                              <td className="  border-blue-500 px-0 md:p-3">
                                {children}
                              </td>
                            ),
                            br: ({ children }) => (
                              <br className="">{children}</br>
                            ),
                            // a: ({ href, children }) => {
                            //   {
                            //     if (part.text.includes("pdf")) {
                            //       return (
                            //         <FaFilePdf
                            //           // onClick={href}
                            //           size={40}
                            //           color="red"
                            //           className="border p-1 border-gray-900 rounded-sm"
                            //         />
                            //       );
                            //     }
                            //     if (
                            //       part.text.includes("png") ||
                            //       part.text.includes("jpg")
                            //     ) {
                            //       return (
                            //         <img
                            //           className="mb-5"
                            //           alt="image"
                            //           src={children as string}
                            //           width={150}
                            //           height={150}
                            //         ></img>
                            //       );
                            //     }
                            //   }
                            // },

                            ul: ({ children }) => (
                              <ul className="list-disc ">{children}</ul>
                            ),

                            ol: ({ children }) => (
                              <ol className="list-decimal">{children}</ol>
                            ),

                            li: ({ children }) => (
                              <li className="ml-5 ">{children}</li>
                            ),

                            blockquote: ({ children }) => (
                              <blockquote className="">{children}</blockquote>
                            ),

                            hr: () => <hr className="border-gray-600 my-4" />,

                            pre: ({ children }) => (
                              <pre className="bg-black/80  rounded-lg overflow-x-auto my-3 text-sm">
                                {children}
                              </pre>
                            ),
                            code: ({ className, children }) => {
                              const isBlock = className?.includes("language-");
                              return isBlock ? (
                                //@ts-expect-error:ts error fix
                                <SyntaxHighlighter
                                  language="javascript"
                                  style={prismaStyles.atomDark}
                                >
                                  {children}
                                </SyntaxHighlighter>
                              ) : (
                                <code className="bg-gray-800 rounded custom-scrollbar text-red-400 text-sm">
                                  {children}
                                </code>
                              );
                            },
                          }}
                        >
                          {textContent}
                        </ReactMarkdown>
                      </Accordian>
                      {/* {JSON.stringify(msg.tool_calls)} */}
                    </div>
                  ) : (
                    // final resulted message
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => (
                          <p className="leading-relaxed m-2">{children}</p>
                        ),

                        h1: ({ children }) => (
                          <h1 className="text-2xl font-bold">{children}</h1>
                        ),

                        h2: ({ children }) => (
                          <h2 className="text-xl font-semibold">{children}</h2>
                        ),

                        h3: ({ children }) => (
                          <h3 className="text-lg font-semibold mt-2">
                            {children}
                          </h3>
                        ),
                        h4: ({ children }) => (
                          <h4 className="text-lg font-semibold mt-2">
                            {children}
                          </h4>
                        ),

                        strong: ({ children }) => (
                          <strong className="font-bold ">{children}</strong>
                        ),
                        // em: ({ children }) => (
                        //   <div className="border-l-4 rounded-md px-2 mt-2 bg-textarea">
                        //     <em className="italic text-blue-500">
                        //       {children}
                        //     </em>
                        //   </div>
                        // ),
                        table: ({ children }) => (
                          <table border={1} className=" mt-5 mb-5">
                            {children}
                          </table>
                        ),
                        th: ({ children }) => (
                          <th className=" border-blue-500 px-0 bg-white text-black">
                            {children}
                          </th>
                        ),
                        tr: ({ children }) => (
                          <tr className=" border-blue-500  px-0 md:p-3">
                            {children}
                          </tr>
                        ),
                        td: ({ children }) => (
                          <td className="  border-blue-500 px-0 md:p-3">
                            {children}
                          </td>
                        ),
                        br: ({ children }) => <br className="">{children}</br>,
                        // a: ({ href, children }) => {
                        //   {
                        //     if (part.text.includes("pdf")) {
                        //       return (
                        //         <FaFilePdf
                        //           // onClick={href}
                        //           size={40}
                        //           color="red"
                        //           className="border p-1 border-gray-900 rounded-sm"
                        //         />
                        //       );
                        //     }
                        //     if (
                        //       part.text.includes("png") ||
                        //       part.text.includes("jpg")
                        //     ) {
                        //       return (
                        //         <img
                        //           className="mb-5"
                        //           alt="image"
                        //           src={children as string}
                        //           width={150}
                        //           height={150}
                        //         ></img>
                        //       );
                        //     }
                        //   }
                        // },

                        ul: ({ children }) => (
                          <ul className="list-disc ">{children}</ul>
                        ),

                        ol: ({ children }) => (
                          <ol className="list-decimal">{children}</ol>
                        ),

                        li: ({ children }) => (
                          <li className="ml-5 ">{children}</li>
                        ),

                        blockquote: ({ children }) => (
                          <blockquote className="">{children}</blockquote>
                        ),

                        hr: () => <hr className="border-gray-600 my-4" />,

                        pre: ({ children }) => (
                          <pre className="bg-black/80  rounded-lg overflow-x-auto my-3 text-sm">
                            {children}
                          </pre>
                        ),
                        code: ({ className, children }) => {
                          const isBlock = className?.includes("language-");
                          return isBlock ? (
                            //@ts-expect-error:ts error fix
                            <SyntaxHighlighter
                              language="javascript"
                              style={prismaStyles.atomDark}
                            >
                              {children}
                            </SyntaxHighlighter>
                          ) : (
                            <code className="bg-gray-800 rounded custom-scrollbar text-red-400 text-sm">
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {textContent}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  },
);

ChatMessages.displayName = "ChatMessages";

export default ChatMessages;
