import React, { memo, ReactNode, useCallback, useEffect, useRef } from "react";
import { BsPlus } from "react-icons/bs";
import { MdOutlinePostAdd, MdRecordVoiceOver } from "react-icons/md";
import { FaArrowUp, FaStop } from "react-icons/fa6";
import { ExpandTextArea, fileIcon } from "@/helper";
import { useEditor } from "@/lib/zustand/store";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { promptAreaSchema, promptAreaSchemaType } from "@/schema/hook";
import { useTextAreaContext } from "@/lib/context/TextAreaContext";

interface TextArea {
  toggleSidebar?: (state?: boolean) => void;
  handleClick?: (search: string) => void;
  onFileUpload?: () => void;
  children: ReactNode;

  // new
  submit: (prompt: string) => void;
}
const TextAreaV2 = memo(
  ({
    toggleSidebar,
    handleClick,
    onFileUpload,
    children,

    // new props
    submit,
  }: TextArea) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const { setIsFieldEmpty } = useTextAreaContext();

    // const handleSearch = (text: string) => {
    //   setSearchText(text);
    //   ExpandTextArea(textareaRef);
    // };
    const { register, handleSubmit, reset } = useForm<promptAreaSchemaType>({
      resolver: zodResolver(promptAreaSchema),
    });

    const activeFile = useEditor((store) => store.activeFile);
    const openFiles = useEditor((store) => store.openFiles);
    const onSubmit = async (data: promptAreaSchemaType) => {
      if (!data.prompt) return;
      submit(data.prompt);
      reset();
    };

    const { ref: formRef, ...registerProps } = register("prompt");

    return (
      <div className="flex w-full  bg-[#313131] rounded-b-2xl shadow-xl">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col relative w-full"
        >
          <textarea
            {...registerProps}
            ref={(el) => {
              formRef(el);
              textareaRef.current = el;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit(onSubmit)(e);
              }
            }}
            rows={1}
            onChange={(e) => {
              const value = e.currentTarget.value;
              ExpandTextArea(textareaRef, false);
              setIsFieldEmpty(!!value);
            }}
            onClick={() => toggleSidebar?.(false)}
            placeholder="What's on your mind..."
            className={`text-start resize-none  ${openFiles.length > 0 ? "mt-8" : "mt-0"} custom-scrollbar bg-transparent w-full text-white placeholder:text-[#b3b1b1] px-2 py-2  focus:outline-none`}
          />
          <div className="p-2 flex justify-between  w-full text-white">
            {children}
          </div>

          {/* {errors.prompt && <ErrorMessage error={errors.content?.message} />} */}
        </form>
      </div>
    );
  },
);
TextAreaV2.displayName = "TextAreaV2";
export default TextAreaV2;
