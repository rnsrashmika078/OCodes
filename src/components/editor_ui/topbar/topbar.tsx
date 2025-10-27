import { SubItems } from "@/lib/samples/data";
import { Tabfunctions } from "@/lib/util_functions/function";
import React, { HTMLAttributes } from "react";

export function TopBarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="z-[10000] text-white flex items-center w-full h-10 bg-black/60 px-4 shadow-md">
      {children}
    </div>
  );
}

export function Sections({
  children,
  name,
}: {
  children: React.ReactNode;
  name: string;
}) {
  return (
    <div className="relative mx-2 group">
      <button className="flex items-center px-3 py-1 hover:bg-white/20 rounded transition">
        {name}
      </button>
      <div className="absolute left-0 top-full  hidden group-hover:flex flex-col bg-[#111] rounded shadow-lg min-w-[120px]">
        {children}
      </div>
    </div>
  );
}

export function SectionItems({
  children,
  ...rest
}: {
  children: React.ReactNode;
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="flex flex-col text-sm text-white" {...rest}>
      {React.Children.map(children, (child) => (
        <div className="px-4 py-2 hover:bg-white/20 cursor-pointer transition">
          {child}
        </div>
      ))}
    </div>
  );
}

export default function TopBar() {
  return (
    <TopBarLayout>
      <Sections name="File">
        <SectionItems>
          {SubItems[0].map((item) => (
            //@ts-expect-error: key doesn't identify by the ts
            <div key={item.name}>
              <div
                className="flex items-center gap-2"
                onClick={() => Tabfunctions(item.name)}
              >
                <item.icon /> {item.name}
              </div>
            </div>
          ))}
        </SectionItems>
      </Sections>
      <Sections name="Edit">
        <SectionItems>
          {SubItems[1].map((item) => (
            //@ts-expect-error: key doesn't identify by the ts
            <div key={item.name}>
              <div
                className="flex items-center gap-2"
                onClick={() => Tabfunctions(item.name)}
              >
                <item.icon /> {item.name}
              </div>
            </div>
          ))}
        </SectionItems>
      </Sections>
      <Sections name="Memory">
        <SectionItems>
          {SubItems[2].map((item) => (
            //@ts-expect-error: key doesn't identify by the ts
            <div key={item.name}>
              <div
                className="flex items-center gap-2"
                onClick={() => Tabfunctions(item.name)}
              >
                <item.icon /> {item.name}
              </div>
            </div>
          ))}
        </SectionItems>
      </Sections>
    </TopBarLayout>
  );
}
