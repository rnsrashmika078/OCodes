import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useState } from "react";
import { IoIosArrowDropdownCircle } from "react-icons/io";

interface AccordianProps {
  children: ReactNode;
  header?: string;
  visibility: boolean;
}
const Accordian = ({ header, children, visibility = true }: AccordianProps) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!visibility) return;
  return (
    <div className="flex flex-col w-full p-2 border border-gray-500 rounded-xl mb-5">
      <div className="flex justify-between bg-gray-900 p-2 rounded-xl items-center">
        {header || "Accordion"}
        <IoIosArrowDropdownCircle
          className={`${isOpen ? "rotate-180" : "rotate-0"}`}
          onClick={() => setIsOpen((prev) => !prev)}
        />
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden mt-2"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Accordian;
