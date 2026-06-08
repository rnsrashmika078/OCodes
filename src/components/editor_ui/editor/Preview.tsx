import { useEditor } from "@/lib/zustand/store";
import { method } from "happy-dom/lib/PropertySymbol.js";
import { memo, useEffect, useRef, useState } from "react";
import { BiRefresh } from "react-icons/bi";
type PreviewProps = {
  code: string;
};

const Preview = memo(({ code }: PreviewProps) => {
  const devServerStatus = useEditor((store) => store.devServer);
  const [isServer, setIsServer] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const checkViteServer = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("http://localhost:5174/", { method: "GET" });
      if (!res.ok) console.log("cannot connect");
      setIsServer(true);
      setRefreshing(false);
    } catch (err) {
      setIsServer(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const check = () => {
      checkViteServer();
    };
    check();
  }, [devServerStatus]);

  const dummy = `
  function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>HI THERE</div>
    </>
  )
}

  `;
  return (
    <>
      <button
        aria-label="refresh"
        onClick={() => checkViteServer()}
        className={`p-1 ${refreshing ? "animate-spin" : ""}`}
      >
        <BiRefresh color="white" size={16} />
      </button>

      {!isServer ? (
        <div className=" h-full overflow-y-auto w-full p-4 bg-gradient-to-bl from-[#000000] via-[#414141]  to-[#000000] ">
          <h1 className="text-1xl">Such a Lovely Day</h1>
          <p className="text-4xl">
            Agents are waiting for you!
          </p>
        </div>
      ) : (
        <div className=" h-full overflow-y-auto">
          <iframe
            src={`http://localhost:5174/`}
            className="w-full h-full border-0"
          />
        </div>
      )}
    </>
  );
});
Preview.displayName = "Preview";

export default Preview;
