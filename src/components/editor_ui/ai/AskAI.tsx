import { useEffect, useRef, useState } from "react";
import { BsPlus } from "react-icons/bs";
import { MdRecordVoiceOver } from "react-icons/md";
import { FaArrowUp } from "react-icons/fa6";
import { useEditor } from "@/lib/zustand/store";
import { v4 as uuidv4 } from "uuid";
import { useGlobalContext } from "@/lib/context/GlobalContext";
import { z } from "zod";
import { parse } from "jsonc-parser";

interface ASKAI {
  toggleSidebar?: (state?: boolean) => void;
}
const AskAI = ({ toggleSidebar }: ASKAI) => {
  const { conversation, setConversation } = useGlobalContext();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [searchText, setSearchText] = useState<string>("");

  //zustand - global states
  // const setUserMessages = useEditor((store) => store.setUserMessages);
  const setNotification = useEditor((store) => store.setNotification);
  const setTrackId = useEditor((store) => store.setTrackId);
  const trackId = useEditor((store) => store.trackId);
  const setChat = useEditor((store) => store.setChats);
  const setUpdateMessage = useEditor((store) => store.setUpdateMessage);
  const userMessages = useEditor((store) => store.userMessages);
  const activeChat = useEditor((store) => store.activeChat);
  const project = useEditor((store) => store.project);
  const activeFile = useEditor((store) => store.activeFile);
  const setUpdateOpenFiles = useEditor((store) => store.setUpdateOpenFiles);
  const setUpdateProjectFile = useEditor((store) => store.setUpdateProjectFile);

  const handleSearch = (text: string) => {
    setSearchText(text);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;

      const maxHeight = 200;

      textareaRef.current.style.height =
        Math.min(scrollHeight, maxHeight) + "px";

      textareaRef.current.style.overflowY =
        scrollHeight > maxHeight ? "auto" : "hidden";
    }
  };

  const handleAskAi = (prompt: string) => {
    let id = trackId ?? uuidv4();
    let messageId = uuidv4();

    setConversation((prev) => [
      ...prev,
      { chatId: trackId ?? id, message: prompt, messageId, role: "user" },
    ]);

    setSearchText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    const modifiedPrompt = `YOU ARE OzoneGPT, an AI coding assistant.

    PROJECT PATH: ${JSON.stringify(project?.path)}
    CURRENT OPEN FILE: ${JSON.stringify(activeFile)}

    if Project Path is null then output please choose project and end immediately
    and if the current Open file exist then update that file if user intention is to update.
    STRICT OUTPUT RULES:
    - Return ONLY  VALID JSON.
    - NO markdown fences, NO explanations.
    - JSON must be strictly parsable by JSON.parse().
    
    JSON FORMAT:
    {
      "title": "string",
      "reply": "string",
      "code": string (JSON-escaped),
      "filePath": "string or null"
      "Task" : "string" -> if file updating set this to "Updating" , if not "Creating" 
    }
    
    CODE ENCODING RULES:
    - The "code" value MUST be a single string where:
      1. All newlines are replaced with \\n.
      2. All double quotes are escaped with \\.
      3. The code is a complete, self-contained React component.
      4. The filePath structure: \\src\\component\\{componentName}.{extension} 
      5. for styling use inline css.
    
    BEHAVIOR:
    - Coding task: Provide full component code and filePath.
    - Non-coding task: Set code and filePath to null.
    
    CONTEXT:
    ... USER PROMPT:${JSON.stringify(prompt)}
    ... Previous Chat: ${JSON.stringify(conversation)}
    `;
    if (modifiedPrompt) {
      const askFromAI = async () => {
        const reply = await window.chatgpt.ask(modifiedPrompt, "");
        const newMessageId = uuidv4();

        if (!reply) return;
        if (reply?.error) {
          setNotification(reply.message);
        }

        setConversation((prev) => [
          ...prev,
          {
            chatId: trackId ?? id,
            message: reply.message,
            messageId: newMessageId,
            role: "assistant",
          },
        ]);

        // const aiMessage = reply.message;
        // const rawMessage = aiMessage;
        // if (!trackId && !activeChat?.chatId) {
        //   const title = aiMessage.split("*$$*")[1] || "Chat";
        //   const chatData = { chatId: id, title: title };
        //   setChat(chatData);
        //   setUpdateMessage(messageId, rawMessage);
        //   setTrackId(id);
        //   return;
        // }
        // setUpdateMessage(messageId, rawMessage);
      };
      askFromAI();
    }
  };

  useEffect(() => {
    const lastMessage = conversation.at(-1);

    if (!lastMessage) return;
    const data = parse(lastMessage?.message);

    if (!data) return;
    console.log(data.code);

    // const OCodeSchema = z.object({
    //   title: z.string(),
    //   reply: z.string(),
    //   // filePath: z.string().optional().nullable(),
    //   code: z.string().optional().nullable(),
    // });
    // const result = OCodeSchema.safeParse(data);
    // console.log("result", result);
    // if (!result.data) return;
    // console.log("file path", result.data.filePath);

    // Regex extractions

    // const folderNameMatch = lastMessage.match(/FolderName:\s*(.*)/);
    // const filePathMatch = lastMessage.match(/FilePath:\s*(.*)/);
    // const code = lastMessage.split("```")[1];
    // const cleanedCode = code?.split("\n")?.slice(1)?.join("\n");

    // const folderName = folderNameMatch ? folderNameMatch[1].trim() : "";
    // const filePath = filePathMatch ? filePathMatch[1].trim() : "";

    const newfilePath = project?.path + data.filePath;
    const CreateFile = async () => {
      if (!data.filePath) {
        return;
      }
      const result = await window.fsmodule.create(newfilePath, data.code);

      if (result) {
        const updatedFile = {
          id: result?.id ?? "",
          content: result.content ?? "",
          name: result.name ?? "",
          path: result.filePath ?? "",
          type: result.type ?? "",
        };
        setUpdateOpenFiles(updatedFile);
        setUpdateProjectFile(updatedFile);
      }
    };

    CreateFile();
  }, [conversation]);

  return (
    <div className=" relative flex items-end w-full  bg-[#313131] rounded-2xl shadow-xl">
      <div className="absolute bottom-2 left-2 flex items-center">
        <span className="cursor-pointer rounded-full p-1 hover:bg-[#444444] transition-all">
          <BsPlus color="white" size={28} />
        </span>
      </div>

      <textarea
        ref={textareaRef}
        value={searchText}
        rows={1}
        onClick={() => toggleSidebar?.(false)}
        placeholder=""
        onChange={(e) => handleSearch(e.target.value)}
        className=" resize-none custom-scrollbar bg-transparent w-full text-white placeholder:text-[#b3b1b1] px-10 py-3 pr-12 rounded-2xl focus:outline-none"
      />

      <div className="relative">
        {/* Send / Voice */}
        {searchText ? (
          <div
            className="absolute bottom-2 right-2 cursor-pointer p-2 rounded-full bg-white hover:bg-gray-200 transition-all"
            onClick={() => handleAskAi(searchText.trim())}
          >
            <FaArrowUp color="black" size={18} strokeWidth={0.5} />
          </div>
        ) : (
          <div className="absolute bottom-2 right-2 cursor-pointer p-2 rounded-full hover:bg-[#444444] transition-all">
            <MdRecordVoiceOver color="white" size={20} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AskAI;
