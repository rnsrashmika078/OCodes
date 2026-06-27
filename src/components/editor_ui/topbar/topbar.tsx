import React, { memo, HTMLAttributes, useCallback } from "react";
import { SubItems } from "@/lib/samples/data";
import { Tabfunctions } from "@/lib/util_functions/function";
import { useEditor } from "@/lib/zustand/store";

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

const TopBar = memo(() => {
  const setCWD = useEditor((s) => s.setCurrentWorkingDirectory);
  const setProject = useEditor((s) => s.setProject);
  const project = useEditor((s) => s.project);

  const handleClick = useCallback((name: string) => {
    Tabfunctions(name);
  }, []);

  return (
    <TopBarLayout>
      {/* FILE */}
      <Sections name="File">
        <SectionItems>
          {SubItems[0].map((item) => (
            <div key={item.name}>
              <div
                className="flex items-center gap-2"
                onClick={async () => {
                  handleClick(item.name);

                  const result = await window.fsmodule.pick();
                  setCWD(result.path);
                  if (!result) return;
                  const prevProject = project;
                  if (result.path) {
                    setProject(result);
                    return;
                    setProject(prevProject);
                  }
                }}
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
