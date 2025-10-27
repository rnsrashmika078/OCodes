import { useRef, useState } from "react";

interface TextareaProps {
  toggleSidebar: (state?: boolean) => void;
  isToggle?: boolean;
  className?: string;
}
const Textarea = ({ toggleSidebar, isToggle, className }: TextareaProps) => {
  //states
  const [searchText, setSearchText] = useState<string>("");

  //functions
  const handleSearch = (text: string) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
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

    return (
      <textarea
        ref={textareaRef}
        value={searchText}
        rows={1}
        onClick={() => toggleSidebar?.(false)}
        placeholder="Enter Message here..."
        onChange={(e) => handleSearch(e.target.value)}
        className={`${className} resize-none custom-scrollbar bg-transparent w-full text-white placeholder:text-[#b3b1b1] px-10 py-3 pr-12 rounded-2xl focus:outline-none`}
      />
    );
  };
};
export default Textarea;
