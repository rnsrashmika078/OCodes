/* eslint-disable @typescript-eslint/no-explicit-any */
import Accordian from "@/components/custom/accordian";
import { ExtendedMessage } from "@/lib/types/type";
import {
  extractTextContent,
  isAIMessage,
  isHumanMessage,
  isToolMessage,
} from "@/utils";
import { memo } from "react";
import ReactMarkdown from "react-markdown";

const ChatMessages = memo(
  ({
    messages,
    isLoading,
  }: {
    messages: ExtendedMessage[];
    isLoading: boolean;
  }) => {
    console.log("all messages", messages);

    return (
      <>
        {messages.map((msg, messageIndex) => {
          if (typeof msg != "object") return false;

          const isToolMsg = isToolMessage(msg);
          const isAiMsg = isAIMessage(msg);
          const textContent = extractTextContent(msg.content);
          const reasoningContent = msg.additional_kwargs?.reasoning_content;
          const tool_call_result = msg.tool_calls;
          console.log("isLoading", isLoading);

          return (
            <div key={msg.id || messageIndex} className="p-2">
              {/* Message */}
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
                  {/* Loading spinner */}
                  {isLoading && isAiMsg && (
                    // <div className="px-4 py-2 bg-gray-200 rounded-2xl w-fit animate-pulse"></div>
                    <div className="mb-2 w-fit px-2 py-2 animate-pulse bg-gray-50 rounded-2xl "></div>
                  )}
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

                  {/* {textContent} */}
                  {Array.isArray(tool_call_result) &&
                    tool_call_result.map((t, idx) => (
                      <div key={t.id} className="w-full">
                        <Accordian
                          visibility={!!tool_call_result}
                          header={`Tool Call: ${t.name.toUpperCase()}`}
                        >
                          <ReactMarkdown>
                            {JSON.stringify(t, null, 6)}
                          </ReactMarkdown>
                        </Accordian>
                      </div>
                    ))}
                  {/* final message content */}
                  {isToolMsg ? ( //tool result
                    <div className="whitespace-pre-wrap">
                      <Accordian
                        visibility={!!isToolMsg}
                        header={`Tool Result`}
                      >
                        <ReactMarkdown>{JSON.parse(textContent)}</ReactMarkdown>
                      </Accordian>
                      {/* {JSON.stringify(msg.tool_calls)} */}
                    </div>
                  ) : (
                    // final resulted message
                    <ReactMarkdown>{textContent}</ReactMarkdown>
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
