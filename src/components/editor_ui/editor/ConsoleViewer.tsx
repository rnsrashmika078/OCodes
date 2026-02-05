import Button from "@/components/custom/Button";
import { useRef } from "react";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";

export default function ConsoleViewer() {
  const termRef = useRef<HTMLDivElement | null>(null);

  const createTerminal = () => {
    if (!termRef.current) return;
    const term = new Terminal({
      fontSize: 14,
      cursorBlink: true,
    });

    term.open(termRef.current);
    window.terminal.create();

    term.onData((data) => {
      console.log("data", data);
      term.write(data);
      window.terminal.write(data);
    });
  };

  return (
    <div ref={termRef} className="w-full h-full bg-black">
      <div className="fixed left-0">
        <Button onClick={() => window.terminal.write("HI THERE")}>
          Create new terminal
        </Button>
      </div>
    </div>
  );
}
