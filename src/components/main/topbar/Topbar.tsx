import { useChatClone } from "@/zustand/store";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const Topbar = () => {
  const createFile = useChatClone((store) => store.setCreateFile);
  const activeFile = useChatClone((store) => store.activeFile);

  const mainItems = [
    { name: "File", subitem: ["New", "Open", "Save"] },
    { name: "Edit", subitem: ["Undo", "Redo", "Cut", "Copy", "Paste"] },
    { name: "Run", subitem: ["Start debugging", "Run without debugging"] },
  ];

  const [hoveringState, setHoveringState] = useState<{
    item: string;
    hover: boolean;
  }>();

  async function Tabfunctions(subElement: string) {
    switch (subElement) {
      case "New": {
        createFile({
          id: uuidv4(),
          content: "Press Ctrl + I to Open the AI. Otherwise type your own",
          node: null,
        });
        return;
      }
      case "Save": {
        await window.fsmodule.create(
          activeFile?.content,
          "",
          activeFile?.node?.name
        );
      }
    }
  }

  return (
    <div className="z-[10000] text-white flex w-full h-8 bg-[#00000037]">
      <div className="flex mx-5 space-x-4">
        {mainItems.map((item) => (
          <div
            //@ts-ignore
            key={item.name}
            className="relative"
            onMouseEnter={() =>
              setHoveringState({ item: item.name, hover: true })
            }
            onMouseLeave={() =>
              setHoveringState({ item: item.name, hover: false })
            }
          >
            {/* Main item */}
            <button className="px-3 py-1 hover:bg-[#222] rounded">
              {item.name}
            </button>

            {/* Subitems dropdown */}
            {hoveringState?.item === item.name && (
              <ul className="absolute left-0 mt-1 bg-[#111] rounded shadow-md">
                {item.subitem.map((sub) => (
                  <li
                    //@ts-ignore
                    key={sub}
                    onClick={() => {
                      Tabfunctions(sub);
                      setHoveringState({ item: "", hover: false });
                    }}
                    className={`px-4 py-2  cursor-pointer ${
                      !activeFile && sub.toLowerCase() === "save"
                        ? "text-[#333] hover:bg-transparent"
                        : "hover:bg-[#333]"
                    }`}
                  >
                    {sub}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Topbar;
