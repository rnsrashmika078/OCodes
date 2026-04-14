import { ipcMain } from "electron";
import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";
import { createFileTool, currentTime, wetherTool } from "./skills";
export function ollamaQuery() {
  ipcMain.handle("ask-chatgpt", async (_event: any, prompt: any) => {
    try {
      if (!prompt) return;

      const result = await generateText({
        model: groq("llama-3.3-70b-versatile"),
        system: `
        You are a coding agent.
        Use tools when needed.
        always give very short answer.
       
        `,
        prompt: prompt,
        tools: {
          currentTime,
          wetherTool,
          createFileTool,
        },
        //@ts-expect-error:max steps
        maxSteps: 5,
      });

      console.log("text", result.text);
      console.log("toolCall", result.toolCalls);
      console.log("toolResults", result.toolResults);

      return {
        text: result.text,
        toolResults: result.toolResults,
      };
    } catch (err) {
      console.log(err);
    }
  });
}
