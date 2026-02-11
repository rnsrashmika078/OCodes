import { useRef } from "react";
import RefModel, { RefModelProps } from "./model_v1";

const Ground = () => {
  const modelRef = useRef<RefModelProps | null>(null);
  return (
    <div className="p-5 space-x-2">
      <button
        className="bg-gray-900 hover:bg-gray-800 hover:scale-110 transition-all text-white px-5 py-2 rounded-xl"
        onClick={() => modelRef.current?.open()}
      >
        Open
      </button>
      <button
        className="bg-gray-900 hover:bg-gray-800 hover:scale-110 transition-all text-white px-5 py-2 rounded-xl"
        onClick={() => modelRef.current?.close()}
      >
        Close
      </button>
      <RefModel ref={modelRef} />
    </div>
  );
};
export default Ground;
