import json
from typing import Optional
from datetime import datetime
from zoneinfo import ZoneInfo

from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, SystemMessage, ToolMessage, AIMessage
from langchain.agents import create_agent
from tools import (
    normal_chat,
    generate_chart,
    get_current_time,
    generate_files_with_python_code,
)
from langchain.agents.middleware import wrap_model_call, ModelRequest, ModelResponse

stop = False

messages = []


llm = ChatOllama(
    model="gemma4:e4b",
    temperature=0,
    reasoning=False,
)


async def initAgent():
    agent = create_agent(
        llm,
        tools=[
            get_current_time,
            normal_chat,
            generate_chart,
            generate_files_with_python_code,
        ],
        middleware=[],
        system_prompt=SystemMessage(
            content="You are a coding assistant. Use tools when needed. Never output tool calls as text.\n\n"
            "TOOLS:\n"
            "- get_current_time → time queries\n"
            "- generate_python_code → generate Python code\n"
            "- generate_chart → charts or visualizations\n"
            "- normal_chat → general conversation\n\n"
            "RULES:\n"
            "- Respond in markdown\n"
            "- Reuse existing filenames\n"
            "- Short answers only\n"
            "- Math → final answer only\n"
        ),
    )

    return agent


async def requestLLM(prompt: str):
    messages.append(HumanMessage(content=prompt))
    tool = ""
    full_response = ""
    agent = await initAgent()

    async for chunk, metadata in agent.astream(
        {"messages": messages},
        stream_mode="messages",
    ):
        if chunk.type == "AIMessageChunk":
            if chunk.tool_calls:
                tool = chunk.tool_calls
                yield json.dumps(
                    {
                        "message": "",
                        "type": "tool",
                        "t_name": tool[0]["name"],
                        "content": tool,
                    }
                ) + "\n"
            elif chunk.content and chunk.type == "AIMessageChunk":
                yield json.dumps(
                    {
                        "message": chunk.content,
                        "type": "tool",
                        "content": tool,
                        "t_name": None,
                    }
                ) + "\n"
    messages.append(AIMessage(content=full_response))
