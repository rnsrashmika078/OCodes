import React, { useEffect, useState } from "react";

const ConsoleViewer = () => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const oldLog = console.log;
    console.log = (...args) => {
      const message = args.map((a) => String(a)).join(" ");
      setLogs((prev) => [...prev, message]);
      oldLog(...args); // still print to dev console
    };
  }, []);

  return (
    <div className="bg-black text-green-400 font-mono p-2 h-full overflow-y-auto">
      {logs.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
    </div>
  );
};

export default ConsoleViewer;
