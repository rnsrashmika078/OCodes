/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tool, TypedToolCall, TypedToolResult } from "ai";

export interface Conversation {
  messageId: string;
  chatId: string;
  title?: string;
  role: string;
  message: string;
  time?: Date;
}
export interface AuthUser {
  id: string;
  fname: string;
  lname: string;
  email: string;
  token: string;
  authenticated?: string;
}
export interface UpdateChat {
  chatId: string;
  title: string;
}
export interface Reply {
  text: string;
  toolResults: TypedToolResult<{
    currentTime: Tool<{
      time: string;
    }>;
    wetherTool: Tool<
      {
        location: string;
      },
      {
        location: string;
        temperature: number;
      }
    >;
    createFileTool: Tool<
      {
        location: string;
        file_name: string;
        file_extension: string;
        content: string;
      },
      {
        created: boolean;
        path: string;
        message: string;
      }
    >;
  }>[];
}
export interface UserPreference {
  netstats: boolean;
  authstats: boolean;
}
export interface Tree {
  id: string; //this is the child id
  type: string;
  name: string;
  path: string;
  children?: Tree[];
}
export interface FilePath {
  path: string;
  tree: Tree[];
}
export interface OpenFile {
  id: string;
  name: string;
  content: string;
  path: string;
  type: string;
}
export type ChatMessages = {
  id: string;
  role: "assistant" | "user";
  message: string;
  type: "tool" | "message" | "status";
  content?: any[];
  reasoning?: string;
  output_message?: string;
  toolName?: string;
  status:
    | "initializing"
    | "calling_tool"
    | "reasoning"
    | "responding"
    | "replying"
    | "finished";
};

import { Message as LCMessage } from "@langchain/core/messages";

type TMessage = {
  additional_kwargs: {
    reasoning_content: string;
  };
  tool_call_id: string;
  invalid_tool_calls: [];
  tool_call_chunks: [
    {
      args: string;
      id: string;
      name: string;
      index: number;
      type: string;
    },
  ];
  tool_calls: [
    {
      args: object;
      id: string;
      name: string;
      type: string;
    },
  ];
  usage_metadata: {
    input_token_details: object;
    input_tokens: number;
    output_token_details: object;
    output_tokens: number;
    total_tokens: number;
  };
  status: string;
};

export interface ExtendedMessage extends LCMessage, TMessage {}
