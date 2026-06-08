import React, { memo, useRef } from "react";
import { BsPlus } from "react-icons/bs";
import { MdOutlinePostAdd, MdRecordVoiceOver } from "react-icons/md";
import { FaArrowUp, FaStop } from "react-icons/fa6";
import { v4 as uuid } from "uuid";
interface TextArea {
  toggleSidebar?: (state?: boolean) => void;
  handleClick: (search: string) => void;
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  isStreaming: boolean;
  stop: () => Promise<void>;
  startNewThead?: () => void;
  onFileUpload?: () => void;
  actionKey?: string;
  onkeydown?: (content: string) => void;
}
const TextArea = memo(
  ({
    isStreaming,
    actionKey = "Enter",
    toggleSidebar,
    handleClick,
    setSearchText,
    searchText,
    stop,
    startNewThead,
    onFileUpload,
    onkeydown,
  }: TextArea) => {
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
        <div className="absolute bottom-2 left-2 flex items-center gap-1">
          <button aria-label="files_attachment">
            <BsPlus
              color="white"
              className="icon"
              size={24}
              onClick={() => onFileUpload && onFileUpload()}
            />
          </button>
          <button
            aria-label="new_thread"
            onClick={() => startNewThead && startNewThead()}
          >
            <MdOutlinePostAdd color="white" className="icon" size={24} />
          </button>
        </div>

        <textarea
          ref={textareaRef}
          onKeyDown={(e) => {
            if (e.key === actionKey) {
              if (onkeydown) {
                onkeydown(searchText.trim());
              }
            }
          }}
          value={searchText}
          rows={1}
          onClick={() => toggleSidebar?.(false)}
          placeholder=""
          onChange={(e) => handleSearch(e.target.value)}
          className=" resize-none custom-scrollbar bg-transparent w-full text-white placeholder:text-[#b3b1b1] px-16 py-3 pr-12 rounded-2xl focus:outline-none"
        />

        <div className="relative">
          {searchText || isStreaming ? (
            <div
              className="absolute bottom-0 -translate-y-1/2  right-2  cursor-pointer rounded-full "
              onClick={() => {
                if (isStreaming) {
                  stop();
                } else {
                  handleClick(searchText.trim());
                }
              }}
            >
              {!isStreaming ? (
                <FaArrowUp color="white" className="icon" size={20} />
              ) : (
                <FaStop color="white" className="icon" size={20} />
              )}
            </div>
          ) : (
            <div className="absolute bottom-0  -translate-y-1/2  right-2">
              <MdRecordVoiceOver color="white" className="icon" size={20} />
            </div>
          )}
        </div>
      </div>
    );
  },
);
TextArea.displayName = "TextArea";
export default TextArea;
