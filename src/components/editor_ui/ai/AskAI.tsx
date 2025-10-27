import { useEffect, useRef, useState } from "react";
import { BsPlus } from "react-icons/bs";
import { MdRecordVoiceOver } from "react-icons/md";
import { FaArrowUp } from "react-icons/fa6";
import { useEditor } from "@/lib/zustand/store";
import { v4 as uuidv4 } from "uuid";

interface ASKAI {
  toggleSidebar?: (state?: boolean) => void;
}
const AskAI = ({ toggleSidebar }: ASKAI) => {
  // type HoverItem = {
  //   name: string;
  //   isHover: boolean;
  // };
  //states
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [searchText, setSearchText] = useState<string>("");
  // const [hoverItem, setHoverItem] = useState<HoverItem | null>(null);

  //zustand - global states
  const setUserMessages = useEditor((store) => store.setUserMessages);
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

    setUserMessages({
      chatId: trackId ?? id,
      messageId,
      user: prompt,
      ai: "loading",
    });

    setSearchText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    const historyText =
      userMessages && userMessages.length > 0
        ? userMessages
            .map((msg) => `User: ${msg.user}\nAI: ${msg.ai}`)
            .join("\n\n")
        : "No previous messages.";
    const modifiedPrompt = `
     You are OzoneGPT, an AI coding assistant in a code generator application called OCode.
PRIORITY RULES (must follow in order):

before reply, check the project file : ${project ?? "null"}
if project file is null then request the user with reply "Please Choose a project file before proceeds"
and guide user with steps below to create or open a project file with bullets points.
 1.Go to Explorer.
 2.Navigate and Click Open Folder to open a project
and then stop reply from here.
1. Detect User Intent:
   - If user explicitly asks to CREATE A COMPONENT (trigger phrases: "create this component", "create component", "make component", "generate component"):
          - Start with a short "Topics:" line listing what you will do.
       - Output the component info in structured format:
           - ComponentName: <ComponentName>
           - FolderName: <ComponentName>
           - FilePath: <ComponentName>.<extension>
       - Briefly describe what you are doing.
       - Output the file content inside a code block with language tag.
   - if file already created  (user intent is likely code update, bug fix, or explanation):
       - Start with: Updating a file...
       - Output only the updated code inside a fenced code block.
       - Include a short note "Update:" if needed.
       - Skip component creation steps entirely.

2. Non-code replies:
   - Start with a short "Topics:" line listing what you will do.
   - Then 1–2 sentence plan.
   - If user message is unrelated to code/project context, reply exactly:
      "please ask me a question related to the coding"

3. Always keep outputs concise, well-formatted, and structured so a script can parse ComponentName, FolderPath, and FilePath.

-> If history is empty, use this -> ${
      activeFile?.content
    }. This contains the currently open file code.
   
        - Project structure : ${project}
        - Chat history : ${historyText}
        - User message : ${prompt}
`;
    if (modifiedPrompt) {
      const askFromAI = async () => {
        const reply = await window.chatgpt.ask(modifiedPrompt, model);

        if (reply.error) {
          setNotification(reply.message);
        }
        if (!reply) return;
        const aiMessage = reply.message;
        const rawMessage = aiMessage;
        if (!trackId && !activeChat?.chatId) {
          const title = aiMessage.split("*$$*")[1] || "Chat";
          const chatData = { chatId: id, title: title };
          setChat(chatData);
          setUpdateMessage(messageId, rawMessage);
          setTrackId(id);
          return;
        }
        setUpdateMessage(messageId, rawMessage);
      };
      askFromAI();
    }
  };

  useEffect(() => {
    const lastMessage =
      userMessages && userMessages[userMessages.length - 1]?.ai;

    if (!lastMessage) return;

    // Regex extractions
    const folderNameMatch = lastMessage.match(/FolderName:\s*(.*)/);
    const filePathMatch = lastMessage.match(/FilePath:\s*(.*)/);
    const code = lastMessage.split("```")[1];
    const cleanedCode = code?.split("\n")?.slice(1)?.join("\n");

    const folderName = folderNameMatch ? folderNameMatch[1].trim() : "";
    const filePath = filePathMatch ? filePathMatch[1].trim() : "";

    const newfilePath = project?.path + `\\src\\${folderName}\\${filePath}`;
    const CreateFile = async () => {
      if (!filePath) {
        return;
      }
      const result = await window.fsmodule.create(newfilePath, cleanedCode);

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
  }, [userMessages]);

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
