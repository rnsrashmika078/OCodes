import { useCodingEditor } from "@/lib/zustand/coding_store";
import { useEditor } from "@/lib/zustand/store";
import { memo, useEffect, useState } from "react";
import { BiRefresh } from "react-icons/bi";

const Preview = memo(() => {
  const devServerStatus = useEditor((store) => store.devServer);
  const [isServer, setIsServer] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const setError = useCodingEditor((store) => store.setProjectError);

  const checkViteServer = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("http://localhost:5174/", { method: "GET" });
      if (!res.ok) console.log("cannot connect" , res);
      setIsServer(true);
      setRefreshing(false);
    } catch (err) {
      console.log("error project", err);
      setIsServer(false);
      // setError(err)
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const check = () => {
      checkViteServer();
    };
    check();
  }, [devServerStatus]);

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
          <p className="text-4xl">Agents are waiting for you!</p>
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
