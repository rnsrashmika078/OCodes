import React, { memo, HTMLAttributes, useCallback } from "react";
import { SubItems } from "@/lib/samples/data";
import { Tabfunctions } from "@/lib/util_functions/function";

export const TopBarLayout = memo(
  ({ children }: { children: React.ReactNode }) => {
    return (
      <div className="text-white flex items-center w-full h-6 bg-black/60 px-1 shadow-md text-xs">
        {children}
      </div>
    );
  },
);

TopBarLayout.displayName = "TopBarLayout";

export const Sections = memo(
  ({ children, name }: { children: React.ReactNode; name: string }) => {
    return (
      <div className="relative mx-2 group">
        <button className="flex items-center  hover:bg-white/20 rounded transition">
          {name}
        </button>

        <div className="absolute left-0 top-full hidden group-hover:flex flex-col bg-[#111] rounded shadow-lg min-w-[120px]">
          {children}
        </div>
      </div>
    );
  },
);

Sections.displayName = "Sections";

export const SectionItems = memo(
  ({
    children,
    ...rest
  }: {
    children: React.ReactNode;
  } & HTMLAttributes<HTMLDivElement>) => {
    return (
      <div className="flex flex-col text-sm text-white" {...rest}>
        {React.Children.map(children, (child) => (
          <div className="px-4 py-2 hover:bg-white/20 cursor-pointer transition">
            {child}
          </div>
        ))}
      </div>
    );
  },
);

SectionItems.displayName = "SectionItems";

const TopBar = memo(function TopBar() {

  
  const handleClick = useCallback((name: string) => {
    Tabfunctions(name);
  }, []);
  ("Top bar re render");

  return (
    <TopBarLayout>
      {/* FILE */}
      <Sections name="File">
        <SectionItems>
          {SubItems[0].map((item) => (
            <div key={item.name}>
              <div
                className="flex items-center gap-2"
                onClick={() => handleClick(item.name)}
              >
                <item.icon /> {item.name}
              </div>
            </div>
          ))}
        </SectionItems>
      </Sections>

      {/* EDIT */}
      <Sections name="Edit">
        <SectionItems>
          {SubItems[1].map((item) => (
            <div key={item.name}>
              <div
                className="flex items-center gap-2"
                onClick={() => handleClick(item.name)}
              >
                <item.icon /> {item.name}
              </div>
            </div>
          ))}
        </SectionItems>
      </Sections>

      {/* MEMORY */}
      <Sections name="Memory">
        <SectionItems>
          {SubItems[2].map((item) => (
            <div key={item.name}>
              <div
                className="flex items-center gap-2"
                onClick={() => handleClick(item.name)}
              >
                <item.icon /> {item.name}
              </div>
            </div>
          ))}
        </SectionItems>
      </Sections>
    </TopBarLayout>
  );
});

TopBar.displayName = "TopBar";

export default TopBar;
