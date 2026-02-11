import { AnimatePresence, motion } from "framer-motion";
import { forwardRef, useImperativeHandle, useState } from "react";

export interface RefModelProps {
  open: () => void;
  close: () => void;
}
const RefModel = forwardRef<RefModelProps>((_, ref) => {
  const [open, setOpen] = useState<boolean>(false);

  const openModel = () => setOpen(true);
  const closeModel = () => setOpen(false);

  useImperativeHandle(ref, () => ({
    open: openModel,
    close: closeModel,
  }));

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            delay: 0.5,
          }}
          className="fixed top-1/2 left-1/2  -translate-x-1/2 -translate-y-1/2 border border-gray-200 p-5 transition-all duration-600 rounded-xl w-[500px] h-[500px] shadow-md"
        >
          Ref Model
        </motion.div>
      )}
    </AnimatePresence>
  );
});

RefModel.displayName = "RefModel";

export default RefModel;
