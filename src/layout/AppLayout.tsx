import { useGlobalContext } from "@/lib/context/GlobalContext";
import EditorUI from "./EditorUI";
import { useEffect } from "react";

const AppLayout = () => {
  const { setThreads } = useGlobalContext();
  const fetchThreads = async () => {
    const res = await fetch("http://localhost:3000/api/threads", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
    });

    const result = await res.json();
    console.log("threads ", result.data);
    setThreads(result.data);
  };

  useEffect(() => {
    fetchThreads();
  }, []);

  return (
    <div className="relative bg-[#232222] flex flex-col h-screen font-custom text-[var(--foreground)] overflow-hidden ">
      {/* nav bar goes here */}
      <main className="flex h-screen w-full">
        <EditorUI />
      </main>
      {/* footer can be placed here */}
    </div>
  );
};

export default AppLayout;
