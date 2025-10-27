"use client";
import { useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";
import { HiDotsVertical } from "react-icons/hi";

type DropdownProps = {
  type: "1" | "2" | "3";
  label: string;
  items: { id: number; name: string }[];
  toggle: boolean;
};

const Dropdown = ({ label, items, type = "2", toggle }: DropdownProps) => {
  const [_open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="absolute inline-block text-left" ref={dropdownRef}>
      <button
        // onClick={() => setOpen((prev) => !prev)}
        className="flex items-center p-2 rounded-full hover:bg-[var(--hover)]"
      >
        {type === "1" && (
          <>
            <span>{label}</span>
            <IoIosArrowDown
              className={`bg-white transition-transform duration-200 ${
                toggle ? "rotate-180" : "rotate-0"
              }`}
            />
          </>
        )}
        {type === "2" && <HiDotsVertical />}
        {type === "3" && null}
      </button>
      <AnimatePresence initial={false}>
        {toggle && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute mt-2 w-40 bg-[var(--list-bg-color)] border border-[var(--border-color)] rounded-xl shadow-lg z-10"
          >
            <ul>
              {items.map((item, idx) => (
                <li
                  // @ts-ignore
                  key={idx}
                  className="first:rounded-t-xl last:rounded-b-xl overflow-hidden"
                >
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--hover)]"
                    onClick={() => setOpen(false)}
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
