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
        Use tools when needed.
        After a tool runs, you MUST explain the result in the final answer.
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
