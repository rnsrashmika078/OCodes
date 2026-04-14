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


messages = []
llm = ChatOllama(
    model="llama3.1:8b",
    temperature=0,
    reasoning=False,
)
agent = create_agent(
    llm,
    tools=[
        code_assistant,
        get_current_time,
        create_update_file,
    ],
    middleware=[],
    system_prompt=SystemMessage(
        content=(
            "You are a helpful AI Code assistant for debug and generate codes.reply in short answer\n"
            "If a file is already created earlier in the conversation, ALWAYS reuse the same file name unless the user explicitly asks for a different file.\n"
            "Do NOT create new files for updates.\n"
            "Refer full message history and stick to the context"
            "generated output must be structured as  markdown format.\n"
            "Call 'get_weather' ONLY when the user explicitly asks about weather.\n"
            "Call 'get_current_time' ONLY when the user explicitly asks for current time.\n"
            "Call 'create_update_file' ONLY when the user explicitly asks for create or update a file.\n"
            "Call 'read_file' ONLY when the user explicitly asks for read a file.\n"
            "Call 'load_approve' ONLY when the user explicitly asks for loan approve task.\n"
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


def requestLLM(prompt: str):
    messages.append(HumanMessage(content=prompt))

    full_response = ""
    for chunk, metadata in agent.stream(
        {"messages": messages},
        stream_mode="messages",
    ):
        if chunk.content and chunk.type == "AIMessageChunk":
            full_response += chunk.content
            yield chunk.content

    messages.append(AIMessage(content=full_response))
