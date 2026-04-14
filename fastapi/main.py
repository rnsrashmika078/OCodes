from typing import Optional
from fastapi import FastAPI
from pydantic import BaseModel
from agent import requestLLM
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RequestBody(BaseModel):
    request: str


@app.post("/request")
def request_llm_answer(data: RequestBody):
    try:
        return StreamingResponse(requestLLM(data.request), media_type="text/plain")
    except:
        print("error while generate response")
    # return requestLLM(data.request)
