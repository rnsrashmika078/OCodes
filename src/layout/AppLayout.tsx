import EditorUI from "./EditorUI";

const AppLayout = () => {
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
