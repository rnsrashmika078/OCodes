// main.ts
import express from "express";
import {
  streamText,
  convertToModelMessages,
  pipeDataStreamToResponse,toDataStreamResponse
} from "ai";
import { groq } from "@ai-sdk/groq";
import cors from "cors";
import cookieParser from "cookie-parser";

export function startChatServer(port = 3000) {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );

  app.post("/api/chat", async (req, res) => {
    const { messages } = req.body;
    console.log("hit: localhost:3000/api/chat");

    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      system: `
        Use tools when needed.
        After a tool runs, you MUST explain the result in the final answer.
      `,
      messages: convertToModelMessages(messages),
      maxSteps: 5,
    });

    const response = result.toDataStreamResponse();

    // Copy headers
    response.headers.forEach((value, key) => res.setHeader(key, value));

    // Convert Web ReadableStream to Node stream and pipe
    Readable.fromWeb(response.body).pipe(res);
  });

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}
