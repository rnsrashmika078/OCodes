import { tool } from "ai";
import { homedir } from "node:os";
import path from "node:path";
import fs from "fs/promises";
import { z } from "zod";

export const test = tool({
  description: "return the current time",
  inputSchema: z.object({
    time: z.coerce.date().describe("return the current time as 12.12 AM"),
    replyMessage: z.string().describe("success"),
  }),
  execute: async ({ time }) => {
    return {
      time,
    };
  },
});
export const currentTime = tool({
  description: "Get the current system time",
  inputSchema: z.object({}),
  execute: async () => {
    const now = new Date();

    return {
      time: now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };
  },
});

export const wetherTool = tool({
  description: "Get the weather in a location",
  inputSchema: z.object({
    location: z.string().describe("The location to get the weather for"),
  }),
  execute: async ({ location }) => {
    return {
      location,
      temperature: 72 + Math.floor(Math.random() * 21) - 10,
    };
  },
});
export const createFileTool = tool({
  description: "Create a file in given location",
  inputSchema: z.object({
    location: z
      .string()
      .describe(
        "system location where user need to create a file:exclude home dir"
      ),
    file_name: z.string().describe("user given file name: exclude ext"),
    file_extension: z.string().describe("file extension such as .txt , .doc"),
    content: z.string().describe("user given content for the file"),
  }),

  execute: async (args) => {
    try {
      const filePath = await createFile(
        args.location,
        args.file_extension,
        args.file_name,
        args.content
      );
      return { created: true, message: `File is created at ${filePath}` };
    } catch (e: any) {
      return {
        created: false,
        error: `File is already created ${e?.message}`,
      };
    }
  },
});
async function createFile(
  location: string,
  file_extension: string,
  file_name: string,
  content: string
) {
  const homeDirectory = homedir();
  const dirPath = path.join(homeDirectory, location);
  const filePath = path.join(dirPath, file_name + file_extension);

  await fs.mkdir(dirPath, { recursive: true });
  await fs.writeFile(filePath, content, { flag: "wx" });
  return filePath;
}
