"use client";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { BiCross } from "react-icons/bi";
import { RiCloseFill } from "react-icons/ri";

interface Tabs {
  id: number;
  title: string;
}
interface TabLayout {
  children?: ReactNode | ReactNode[];
  className?: string;
}
const TabLayout = ({ className, children }: TabLayout) => {
  const [tabs, setTabs] = useState<Tabs[]>([]);
  const childCount = React.Children.count(children);
  // const [canEdit, setCanEdit] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<Tabs>();
  const [activeMouse, setActiveMouse] = useState<boolean>(false);
  const [editTabData, setEditTabData] = useState<{
    title: string;
    id: number;
  }>();

  const handleCloseTab = (id: number) => {
    const newTabs = tabs.filter((t) => t.id !== id);
    setTabs(newTabs);
  };

  const handleSaveTab = () => {
    if (editTabData) {
      setTabs((tabs) =>
        tabs.map((t: Tabs) =>
          t.id === editTabData.id
            ? {
                ...t,
                title: editTabData.title ? editTabData.title : "",
              }
            : t
        )
      );
    }
    // setCanEdit(false);
    setEditTabData({ title: "", id: 0 });
  };
  useEffect(() => {
    if (tabs.length === 0 && childCount > 0) {
      const id = Date.now();
      const newTabs = Array.from({ length: childCount }, (_, i) => ({
        id: id + i,
        title: `Tab ${i + 1}`,
      }));

      setTabs(newTabs);
      setActiveTab(newTabs[0]);
    }
  }, [childCount, tabs.length]);
  return (
    <div className={`flex flex-col w-full ${className}`}>
      <div className="flex flex-col">
        <div
          className={` bg-[#1919197b]  transition-all flex flex-row text-center min-w-md ${
            activeMouse ? "custom-scrollbar-x" : ""
          }`}
          onMouseEnter={() => setActiveMouse(true)}
          onMouseLeave={() => setActiveMouse(false)}
        >
          {tabs?.map((tab: Tabs, index: number) => (
            <div
              // @ts-expect-error: tab index issue
              key={index}
              onClick={() => {
                setActiveTab({
                  title: tab.title,
                  id: tab.id,
                });
              }}
              className={`border  border-[#434343] relative flex justify-center transition-all duration-300 hover:cursor-pointer select-none  items-center w-1/2 sm:w-1/2 md:w-1/3 lg:w-1/5 xl:w-1/5 hover:bg-[#232222]  ${
                activeTab && activeTab.id == tab.id
                  ? "bg-[#232222] border-b-0 border-t-blue-500 border-t-4"
                  : "bg-[#1b1b1b7b]"
              } py-1`}
            >
              <p
                className="w-auto text-white p-0.5 mx-5 text-sm  whitespace-nowrap overflow-hidden text-ellipsis max-w-md"
              >
                {tab && tab.title ? tab.title : "New Tab"}
              </p>

              <div
                className="text-white absolute right-2  px-2 rounded-sm"
                onClick={() => handleCloseTab(tab.id)}
              >
                <RiCloseFill />
              </div>
            </div>
          ))}
        </div>
        {Array.isArray(children) ? (
          children &&
          children.map((child, index) => (
            // @ts-expect-error: tab index issue
            <div className="relative" key={index}>
              {activeTab && tabs && activeTab?.id == tabs[index]?.id && child}
            </div>
          ))
        ) : (
          <div className="relative">{tabs.length == 1 && children}</div>
        )}
      </div>
    </div>
  );
};

export default TabLayout;
