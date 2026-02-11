import { useRef, useState } from "react";
import { BsPlus } from "react-icons/bs";
import { MdRecordVoiceOver } from "react-icons/md";
import { FaArrowUp } from "react-icons/fa6";

interface ASKAI {
  toggleSidebar?: (state?: boolean) => void;
  handleClick: (search: string) => void;
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
}
const AskAI = ({
  toggleSidebar,
  handleClick,
  setSearchText,
  searchText,
}: ASKAI) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
            onClick={() => handleClick(searchText.trim())}
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
