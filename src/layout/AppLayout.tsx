import { GlobalContextProvider } from "@/lib/context/GlobalContext";
import EditorUI from "./EditorUI";

const AppLayout = () => {
  return (
    <GlobalContextProvider>
      <div className="relative bg-[#232222] flex flex-col h-screen font-custom text-[var(--foreground)] overflow-hidden ">
        {/* nav bar goes here */}
        <main className="flex h-screen w-full">
          <EditorUI />
        </main>
        {/* footer can be placed here */}
      </div>
    </GlobalContextProvider>
  );
};

export default AppLayout;
