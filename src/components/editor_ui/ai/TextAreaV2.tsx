import React, { memo, ReactNode, useEffect, useRef } from "react";
import { BsPlus } from "react-icons/bs";
import { MdOutlinePostAdd, MdRecordVoiceOver } from "react-icons/md";
import { FaArrowUp, FaStop } from "react-icons/fa6";
import { ExpandTextArea, fileIcon } from "@/helper";
import { useEditor } from "@/lib/zustand/store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { promptAreaSchema, promptAreaSchemaType } from "@/schema/hook";

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
  children: ReactNode;

  // new
  submit: (prompt: string) => void;
}
const TextAreaV2 = memo(
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
    children,

    // new props
    submit,
  }: TextArea) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // const handleSearch = (text: string) => {
    //   setSearchText(text);
    //   ExpandTextArea(textareaRef);
    // };
    const {
      register,
      handleSubmit,
      getValues,
      setValue,
      reset,
      formState: { errors },
    } = useForm<promptAreaSchemaType>({
      resolver: zodResolver(promptAreaSchema),
    });
    const activeFile = useEditor((store) => store.activeFile);
    const onSubmit = async (data: promptAreaSchemaType) => {
      // alert(data.prompt);
      submit(data.prompt);
    };
    console.log("errors", errors);
    return (
      <div className="flex w-full  bg-[#313131] rounded-2xl shadow-xl">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex relative w-full"
        >
          <textarea
            {...register("prompt")}
            // ref={textareaRef}
            onKeyDown={(e) => {
              if (e.key === actionKey) {
                if (onkeydown) {
                  e.preventDefault();
                  ExpandTextArea(textareaRef, true);
                  handleSubmit(onSubmit)(e);
                }
              }
            }}
            rows={1}
            onClick={() => toggleSidebar?.(false)}
            placeholder=""
            className={`resize-none ${activeFile ? "mt-10" : "mt-0 "} custom-scrollbar bg-transparent w-full text-white placeholder:text-[#b3b1b1] px-16 py-2.5 pr-12 rounded-2xl focus:outline-none`}
          />
          {/* <div className="absolute w-fit">{children}</div> */}
          {children}

          {/* {errors.prompt && <ErrorMessage error={errors.content?.message} />} */}
        </form>
      </div>
    );
  },
);
TextAreaV2.displayName = "TextAreaV2";
export default TextAreaV2;

interface ContainerProps {
  children: ReactNode;
  elementPosition?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
}
export const Container = ({
  elementPosition = "bottomLeft",
  children,
}: ContainerProps) => {
  const itemPosition = {
    topLeft: "top-0 left-0",
    topRight: " top-0 right-0",
    bottomLeft: " bottom-0 left-0",
    bottomRight: " bottom-0 right-0",
  };

  return (
    <div className={`absolute  p-1 w-fit ${itemPosition[elementPosition]}`}>
      {children}
    </div>
  );
};
