import React, { memo, useEffect, useRef } from "react";
import { BsPlus } from "react-icons/bs";
import { MdOutlinePostAdd, MdRecordVoiceOver } from "react-icons/md";
import { FaArrowUp, FaStop } from "react-icons/fa6";
import { ExpandTextArea, fileIcon } from "@/helper";
import { useEditor } from "@/lib/zustand/store";
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
      ExpandTextArea(textareaRef);
    };
    const activeFile = useEditor((store) => store.activeFile);
    const openFiles = useEditor((store) => store.openFiles);

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
        <div className="absolute flex    top-5 left-2 -translate-y-1/2  gap-2 cursor-pointer ">
          {activeFile 
            ? (() => {
                const Icon = fileIcon(activeFile.name);

                return (
                  <div className="text-white border rounded-xl px-1 py-1 items-center flex gap-2">
                    {Icon && <Icon />}
                    {activeFile.name}
                  </div>
                );
              })()
            : null}
        </div>
        <textarea
          ref={textareaRef}
          onKeyDown={(e) => {
            if (e.key === actionKey) {
              if (onkeydown) {
                ExpandTextArea(textareaRef, true);
                onkeydown(searchText.trim());
              }
            }
          }}
          value={searchText}
          rows={1}
          onClick={() => toggleSidebar?.(false)}
          placeholder=""
          onChange={(e) => handleSearch(e.target.value)}
          className={`resize-none ${activeFile ? "mt-10 " : "mt-0 "} custom-scrollbar bg-transparent w-full text-white placeholder:text-[#b3b1b1] px-16 py-3 pr-12 rounded-2xl focus:outline-none`}
        />

        <div className="relative">
          {searchText || isStreaming ? (
            <div
              className="absolute bottom-0 -translate-y-1/2  right-2  cursor-pointer rounded-full "
              onClick={() => {
                if (isStreaming) {
                  stop();
                } else {
                  ExpandTextArea(textareaRef, true);
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
