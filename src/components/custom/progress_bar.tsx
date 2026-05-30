import { memo, useEffect, useState } from "react";
type TStatus = "Initializing" | "Ongoing" | "HalfWay" | "Finished";
const ProgressBar = memo(() => {
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<TStatus>("Initializing");
  useEffect(() => {
    const interval = setInterval(() => {
      // const isFinished = Math.max(0, Math.min(progress, 100));
      setProgress((prev) => {
        if (prev === 100) {
          setStatus("Finished");
          return prev;
        }
        if (prev >= 50) {
          setStatus("HalfWay");
          return prev + 20;
        }
        if (prev >= 0) {
          setStatus("Ongoing");
          return prev + 20;
        }
        return prev + 20;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div>{status}</div>
      <div className="relative w-full h-4 border rounded-2xl bg-gray-500">
        <div
          className="absolute top-1/2 transition-all duration-200 -translate-y-1/2  left-0 w-full h-4  border rounded-2xl bg-green-500"
          style={{ width: `${progress + "%"}` }}
        ></div>
      </div>
    </div>
  );
});

ProgressBar.displayName = "ProgressBar";

export default ProgressBar;
