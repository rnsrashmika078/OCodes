from typing import Optional
from datetime import datetime
from zoneinfo import ZoneInfo
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, SystemMessage, ToolMessage, AIMessage
from langchain.agents import create_agent
from tools import (
    code_assistant,
    create_update_file,
    get_current_time,
)
from langchain.agents.middleware import wrap_model_call, ModelRequest, ModelResponse

loading = False


messages = []
llm = ChatOllama(model="llama3.1:8b", temperature=0, reasoning=False).bind_tools(
    [code_assistant, create_update_file, get_current_time]
)
agent = create_agent(
    llm,
    tools=[
        code_assistant,
        create_update_file,
        get_current_time,
    ],
    middleware=[],
)
messages.append(
    SystemMessage(
        content=(
            "You are a helpful AI Code assistant for debug and generate codes.reply in short answer\n"
            "If a file is already created earlier in the conversation, ALWAYS reuse the same file name unless the user explicitly asks for a different file.\n"
            "Do NOT create new files for updates.\n"
            "Refer full message history and stick to the context"
            "generated output must be structured as  markdown format.\n"
            # "Call 'get_weather' ONLY when the user explicitly asks about weather.\n"
            # "Call 'get_current_time' ONLY when the user explicitly asks for current time.\n"
            # "Call 'create_update_file' ONLY when the user explicitly asks for create or update a file.\n"
            # "Call 'read_file' ONLY when the user explicitly asks for read a file.\n"
            # "Call 'load_approve' ONLY when the user explicitly asks for loan approve task.\n"
            "You MUST break complex tasks into multiple tool calls.\n"
            "If one tool depends on another, call them step by step.\n"
            "Example:\n"
            "1. Call get_current_time\n"
            "2. Then pass result to create_update_file\n"
            "Never put tool calls as plain text.\n"
            "for math questions reply the direct answer\n"
            "Call 'code_assistant' ONLY for normal chats\n"
        )
    ),
)


def stream(curr_messages: list):
    try:
        full_response = ""

        for chunk in llm.stream(curr_messages):
            # print(chunk.content, end="", flush=True)
            full_response += chunk.content
            yield chunk.content
        messages.append(AIMessage(content=full_response))
    except:
        print("Error while call stream")


def requestLLM(prompt: str):
    messages.append(HumanMessage(content=prompt))
    response = llm.invoke(messages)
    print(f"all tools request length {len(response.tool_calls)}")

    try:
        if response.tool_calls:
            print(f"all tools request {response.tool_calls}")
            for tool_call in response.tool_calls:
                if tool_call["name"] == "code_assistant":
                    print(f"tools_call: {tool_call["name"]}")
                    curr_messages = []
                    result = code_assistant.invoke(tool_call["args"])
                    # message = ToolMessage(content=result, tool_call_id=tool_call["id"])
                    # message = HumanMessage(content=result)
                    curr_messages.append(
                        ToolMessage(content=result, tool_call_id=tool_call["id"])
                    )
                    yield from stream(curr_messages)

                if tool_call["name"] == "get_current_time":
                    curr_messages = []
                    print(f"tools_call: {tool_call["name"]}")
                    print("tool arguments :time: ", tool_call["args"])
                    result = get_current_time.invoke(tool_call["args"])
                    curr_messages.append(
                        ToolMessage(content=result, tool_call_id=tool_call["id"])
                    )
                    yield from stream(curr_messages)
                if tool_call["name"] == "create_update_file":
                    curr_messages = []
                    print(f"tools_call: {tool_call["name"]}")
                    result = create_update_file.invoke(tool_call["args"])
                    print("result from create_file ", result)
                    print("tool arguments :create", tool_call["args"])
                    curr_messages.append(
                        ToolMessage(content=result, tool_call_id=tool_call["id"])
                    )
                    yield from stream(curr_messages)

            # full_response = ""
            # for chunk in llm.stream(messages):
            #     # print(chunk.content, end="", flush=True)
            #     full_response += chunk.content
            #     yield chunk.content
            # messages.append(AIMessage(content=full_response))
            # return full_response
    except Exception as e:
        message = "Something wrong here!" + str(e)
        yield message
        messages.append(AIMessage(content=message))
