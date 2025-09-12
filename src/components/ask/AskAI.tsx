import { useEffect, useRef, useState } from "react";
import { BsPlus } from "react-icons/bs";
import { MdRecordVoiceOver } from "react-icons/md";
import { FaArrowUp } from "react-icons/fa6";
import { useChatClone } from "@/zustand/store";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/supabase/Supabase";
import { UserMessage } from "@/types/type";

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
  const [chatTitle, setChatTitle] = useState<string | null>(null);


  //zustand - global states
  const setUserMessages = useChatClone((store) => store.setUserMessages);
  const setNotification = useChatClone((store) => store.setNotification);
  const setTrackId = useChatClone((store) => store.setTrackId);
  const trackId = useChatClone((store) => store.trackId);
  const setChat = useChatClone((store) => store.setChats);
  const authUser = useChatClone((store) => store.authUser);
  const setAllmessage = useChatClone((store) => store.setAllmessage);
  const setUpdateMessage = useChatClone((store) => store.setUpdateMessage);
  const userMessages = useChatClone((store) => store.userMessages);
  const activeChat = useChatClone((store) => store.activeChat);

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

  const handleSaveChats = async (chatId: string, title: string) => {
    const chatData = { chatId, title };

    const { error } = await supabase.from("chats").insert([chatData]);

    if (error) {
      console.error("Insert failed:", error.message);
    } else {
      // console.log("Message saved:", data);
    }
  };
  const handleAskAi = (prompt: string) => {
    let id = trackId ?? uuidv4(); // to track the current chat
    let messageId = uuidv4(); /// to track the current message

    // if (!trackId) setTrackId(id);

    //this will show the user prompt in the ChatArea Section without AI response. AI response is on loading..!
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

    const username = authUser?.fname ?? "User";

    const historyText =
      userMessages && userMessages.length > 0
        ? userMessages
            .map((msg) => `User: ${msg.user}\nAI: ${msg.ai}`)
            .join("\n\n")
        : "No previous messages.";
    //     const modifiedPrompt = `
    //         You are OzoneGPT, an AI assistant in a chat application.
    //         Your tasks:
    //         1. Always generate a *$$*short, unique, and descriptive title*$$* for the chat if this is the first message of the chat and wrap it in *$$* (example: *$$*Shopping Tips*$$*).
    // 2. If this is the first message, do NOT say things like "it seems we just started". Instead, greet naturally, for example: "Hi, how can I help you today?".
    //         3. If this is the first message, start by addressing the user by their name ("${username}").
    //         4.If the user asks "do you know my name" or anything similar, you MUST always reply with their exact name: "${username}".
    // Never say you don’t know the name.
    // 5. Don't start the conversation every time with hi "${username}".because it doesn't feel more engage
    //         6. Only mention the user's name later if it makes sense in context. Do not start every reply with the name.
    //         7. Provide your response to the latest user query.
    //         8. Keep the conversation consistent with the previous chat history.
    //         9. Use emojis to make the chat more engaging. but don't spamming like don't use every time every where.
    //         10. Use proper **formatting rules** when replying:
    //            - Use "#" headers for **main topics** (escape like \\# if VS Code warns).
    //            - Use "##" for **subtopics**.
    //            - Highlight **keywords** in bold (wrap with \`**\` like **this**).
    //            - Use bullet points "-" or numbered lists "1." where appropriate.
    //            - For code or commands, wrap in triple backticks (\`\`\`) with the language tag (e.g. \`\`\`js).
    //            - Use blockquote ">" when emphasizing notes or tips.
    //            - For links, use the Markdown format "[link](URL)" to add hyperlinks.
    //            - Keep responses clean, readable, and Markdown-friendly.

    //         11.If user reply to your message with 'yeah', 'yes','ok' or anything similar then replied it according to the conversation.
    //         12.If user reply to your message with 'no thanks', 'no','fine' or anything similar thats user more likely to end the conversation.
    //         Chat History so far:
    //         If from chat history '${prompt}' isn't the first message of the chat, then ignore instruction 1.
    //         ${historyText}
    //         Now, here is the new user message you must reply to:
    //         "${prompt}"
    //         `;
    console.log("HISTORY", historyText);
    const modifiedPrompt = `
You are OzoneGPT, an AI coding assistant in a code generator application called OCode.

Your behavior rules:

1. If this is the **first user request in the chat**, generate a new React component boilerplate.
   - Precede your answer with this exact text: USING FS MODULE: Create a file like this example. example "@@home/Home.tsx@@"
   - Do not wrap this line in code fences. It should be plain text.

2. For **every response**:
   - Provide the code update inside triple backticks with a valid language tag (e.g. \`\`\`tsx, \`\`\`js) and this is very important.
   - The code must always be shown as the **update of the previous code** (never as a fresh snippet unless it’s the very first request).

3. Formatting rules:
   - Keep the output clean, readable, and Markdown-friendly.
   - Never write the language name before the code block (e.g. don’t write 'html' above a fenced block).
   - Only use code fences with a language tag.

4. Chat History:
   - If the current request is **not the first message of the chat**, ignore rule #1 and just follow rule #2 onwards.

Chat History so far:
${historyText}

Now, here is the new user message you must reply to:
"${prompt}"
`;

    if (modifiedPrompt) {
      const askFromAI = async () => {
        const reply = await window.chatgpt.ask(modifiedPrompt); // get the ai response from the api
        console.log("REPLY", reply);

        if (reply.error) {
          setNotification(reply.message);
        }

        if (!reply) return;

        const aiMessage = reply.message;
        // const rawMessage = aiMessage
        //   .replace(/\*[$]{2}\*.*?\*[$]{2}\*/, "")
        //   .trim();

        const rawMessage = aiMessage
          // remove "export default ..."
          .replace(/export\s+default[^{;]+[;]?/g, "")
          // remove "const Something = () => {"
          .replace(/const\s+\w+\s*=\s*\(\)\s*=>\s*{/, "")
          // remove last "};"
          .replace(/};?$/, "")
          .trim();

        if (!trackId && !activeChat?.chatId) {
          const title = aiMessage.split("*$$*")[1] || "Chat"; // ai will generate title inside the astrix marks so grab that title
          setChatTitle(title); // set chat title -> this state use for check the current chat has title so that until the next render cycle this stays as 'not new chat in next message'
          const chatData = { chatId: id, title: title };
          setChat(chatData);
          setUpdateMessage(messageId, rawMessage);
          await handleSaveChats(id, title);

          const message = {
            id: uuidv4(),
            title: title,
            chatId: id,
            user: prompt,
            ai: rawMessage,
          };

          const { data, error } = await supabase
            .from("messages")
            .insert([message]);

          if (error) {
            console.error("Insert failed:", error.message);
          } else {
            console.log("Message saved:", data);
          }
          setTrackId(id);
          return;
        }
        setUpdateMessage(messageId, rawMessage);
        const message = {
          id: uuidv4(),
          title: chatTitle ?? activeChat?.title,
          chatId: activeChat?.chatId ?? id,
          user: prompt,
          ai: rawMessage,
        };
        const { error } = await supabase
          .from("messages")
          .insert([message])
          .select();

        if (error) {
          console.error("Insert failed:", error.message);
        } else {
        }
      };
      askFromAI();
    }
  };

  useEffect(() => {
    if (activeChat?.chatId) {
      const fetchMessagesByChatId = async () => {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("chatId", activeChat.chatId)
          .order("created_at", { ascending: true });

        if (error) {
          console.error("Fetch error:", error.message);
        } else {
          const messages = data as UserMessage[];
          setAllmessage(messages);
        }
      };
      fetchMessagesByChatId();
    }
  }, [activeChat?.chatId]);

  useEffect(() => {
    const lastMessage =
      userMessages && userMessages[userMessages.length - 1].ai;
    if (lastMessage?.includes("USING FS MODULE")) {
      const match = lastMessage.match(/@@(.*?)@@/);
      const filePath = match ? match[1] : null;
      const codematch = lastMessage.match(/```tsx([\s\S]*?)```/);
      const code = codematch ? codematch[1].trim() : null;
      window.fsmodule.create(filePath ?? "", code ?? "");
    }
  }, [userMessages]);

  return (
    <div className="mb-2 relative flex items-end w-full  bg-[#313131] rounded-2xl shadow-xl">
      <div className="absolute bottom-2 left-2 flex items-center">
        <span className="cursor-pointer rounded-full p-1 hover:bg-[#444444] transition-all">
          <BsPlus color="white" size={28} />
        </span>
      </div>
      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={searchText}
        rows={1}
        onClick={() => toggleSidebar?.(false)}
        placeholder=""
        onChange={(e) => handleSearch(e.target.value)}
        className=" resize-none custom-scrollbar bg-transparent w-full text-white placeholder:text-[#b3b1b1] px-10 py-3 pr-12 rounded-2xl focus:outline-none"
      />
      {/* Send / Voice */}
      {searchText ? (
        <span
          className="absolute bottom-2 right-2 cursor-pointer p-2 rounded-full bg-white hover:bg-gray-200 transition-all"
          onClick={() => handleAskAi(searchText.trim())}
        >
          <FaArrowUp color="black" size={18} strokeWidth={0.5} />
        </span>
      ) : (
        <div className="absolute bottom-2 right-2 cursor-pointer p-2 rounded-full hover:bg-[#444444] transition-all">
          <MdRecordVoiceOver color="white" size={20} />
        </div>
      )}
    </div>
  );
};

export default AskAI;
