"use client";
import  { useEffect, useState } from "react";
import { CiSquareRemove } from "react-icons/ci";
import { motion, AnimatePresence } from "framer-motion";
import { useChatClone } from "@/zustand/store";

const Sonner = () => {
  const [show, setShow] = useState(true);
  const notification = useChatClone((store) => store.notifier);
  const setNotification = useChatClone((store) => store.setNotification);

  useEffect(() => {
    if (!notification) return;
    setShow(true);
    const timer = setTimeout(() => setShow(false), 5000);

    return () => {
      setNotification(null);
      clearTimeout(timer);
    };
  }, [notification]);

  const handleVisibility = (visible: boolean) => {
    setNotification(null);
    setShow(visible);
  };

  return (
    <div className="fixed z-[11000] top-0 left-0 w-full flex justify-center " >
      <AnimatePresence>
        {notification && notification.length > 0 && show && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 50, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-96 fixed top-0  -translate-x-1/2 border shadow-md border-[#303030] p-3 rounded-xl bg-[#383838]"
          >
            <>
              <div className="flex justify-between items-center">
                <div className="text-[#d0d0d0] ">
                  <p>{notification.split(".")[0]}</p>
                  <span className="">
                    {notification.split(".")[1]}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <button>
                    <CiSquareRemove
                      size={40}
                      color="red"
                      onClick={() => handleVisibility(false)}
                      className="hover:cursor-pointer"
                    />
                  </button>
                </div>
              </div>
            </>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sonner;
