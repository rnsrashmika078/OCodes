import React from "react";
interface Props {
  tip: string;
  children?: React.ReactNode;
}
const ToolTip = ({ tip, children }: Props) => {
  return (
    <div className="relative w-full text-xs font-custom rounded-r-[5px] bg-black p-1 rounded-l-[5px] px-3 border border-gray-500">
      {/* Arrow */}
      <div
        className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0
                    border-t-8 border-b-8 border-r-8
                    border-t-transparent border-b-transparent
                    border-r-black"
      ></div>

      {tip}
      {children}
    </div>
  );
};

export default ToolTip;
