import  { memo } from "react";

const Threads = memo(() => {
  return (
    <div className="block  p-5 gap-2 text-white w-full ">
      {[...(threads ?? []), ...(localThreads ?? [])].flat().map((t) => {
        return (
          <span
            className="border p-2 border-white rounded-xl hover:scale-105 transition-all cursor-pointer"
            key={t.threadId}
            onClick={async () => {
              setOpenNewThread(true);
              setActiveThread(t.threadId);

              try {
                await stream.switchThread(t.threadId);
              } catch (e) {
                //silent the stream undefinde isue..
              }
            }}
          >
            {t.threadId}
          </span>
        );
      })}
    </div>
  );
});
Threads.displayName = "Threads";

export default Threads;
