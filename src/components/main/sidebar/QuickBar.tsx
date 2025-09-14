import ToolTip from "@/components/common/tooltip/ToolTip";
import React, { useState } from "react";
import { BsFileSlides, BsGear, BsGithub, BsSearch } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { GrDocument } from "react-icons/gr";

// quick types
type TabsProps = {
  name: string;
  icon: JSX.Element;
};

type HoverProps = {
  name: string;
  isHover: boolean;
};
const QuickBar = () => {
  const Tabs: TabsProps[] = [
    {
      name: "Explorer",
      icon: <GrDocument size={25} />,
    },
    {
      name: "Search",
      icon: <BsSearch size={25} />,
    },
    {
      name: "GitHub",
      icon: <BsGithub size={25} />,
    },
    {
      name: "Profile",
      icon: <CgProfile size={25} />,
    },
    {
      name: "Settings",
      icon: <BsGear size={25} />,
    },
  ];

  const [hoverTab, setHoverTab] = useState<HoverProps>();
  return (
    <div
      className="relative flex flex-col bg-gray-900 justify-between items-center"
      style={{ width: "56px" }}
    >
      {/* Top group */}
      <div className="flex flex-col items-center">
        {Tabs.slice(0, Tabs.length - 2).map((t, i) => (
          <div
            // @ts-expect-error: key idenfifer issue
            key={i}
            className="relative transition-all text-gray-400 hover:text-white py-3"
            // onClick={() => alert(t.name)}
            onMouseEnter={() => setHoverTab({ name: t.name, isHover: true })}
            onMouseLeave={() => setHoverTab({ name: "", isHover: false })}
          >
            <div>{t.icon}</div>

            {hoverTab?.name === t.name && (
              <div className="absolute opacity-100 top-1/2  left-[85px] -translate-x-1/2 -translate-y-1/2 hover:opacity-100">
                <ToolTip tip={t.name} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom group */}
      <div className="flex flex-col items-center">
        {Tabs.slice(-2).map((t, i) => (
          <div
            // @ts-expect-error: key idenfifer issue
            key={i}
            className="relative transition-all text-gray-400 hover:text-white py-3"
            onMouseEnter={() => setHoverTab({ name: t.name, isHover: true })}
            onMouseLeave={() => setHoverTab({ name: "", isHover: false })}
          >
            <div>{t.icon}</div>

            {hoverTab?.name === t.name && (
              <div className="absolute opacity-100 top-1/2 left-[85px] -translate-x-1/2 -translate-y-1/2 hover:opacity-100">
                <ToolTip tip={t.name} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickBar;
