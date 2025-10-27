import { DropDownContext, useDropDown } from "@/lib/context/contextApi";
import React, { useState } from "react";

export function DropDownLayout({
  children,
  classname,
}: {
  children: React.ReactNode;
  classname?: string;
}) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <DropDownContext.Provider value={{ open, setOpen }}>
      <div
        className={`text-red-500 ${classname}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        {children}
      </div>
      ;
    </DropDownContext.Provider>
  );
}
export function DropDownSection({
  children,
  select,
  onSelect,
}: {
  children: React.ReactNode;
  select: string;
  onSelect?: (selection: string) => void;
}) {
  const { open } = useDropDown();
  return (
    <div>
      {open &&
        React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return null;
          return (
            //@ts-expect-error:ts key issue
            <div key={index} onClick={() => onSelect?.(child.props.value)}>
              {select !== child.props.value && child}
            </div>
          );
        })}
    </div>
  );
}
export function Item({ value }: { value: string }) {
  return <div>{value}</div>;
}
