import { useEditor } from "@/lib/zustand/store";
import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { WebLinksAddon } from "xterm-addon-web-links";
import "xterm/css/xterm.css";

export const TerminalView = () => {
  const termRef = useRef<HTMLDivElement | null>(null);
  const termRefInstance = useRef<Terminal | null>(null);
  const path = useEditor((store) => store.project?.path);
  const refresh = useEditor((store) => store.refreshServer);

  useEffect(() => {
    if (!path) return;
    if (!termRef.current) return;

    window.terminal.cwd(path);

    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: "Fira Code, monospace",
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    term.focus();
    termRefInstance.current = term;

    term.open(termRef.current);
    // fitAddon.fit();
    const webLinksAddon = new WebLinksAddon();
    term.loadAddon(webLinksAddon);
    term.onData((data) => {
      window.terminal.send(data);
    });

    const cleanup = window.terminal.onData((data) => {
      term.write(data);
      // const text = data.toString();

      // if (
      //   text.includes("Internal server error") ||
      //   text.includes("PARSE_ERROR") ||
      //   text.includes("Transform failed")
      // ) {
      //   console.log("VITE ERROR FROM TERMINAL");
      //   console.log("text", text);
      // }
    });
    window.addEventListener("resize", () => {
      fitAddon.fit();
      window.terminal.resize(term.cols, term.rows);
    });
    return () => {
      if (cleanup) {
        cleanup?.();
      }
      term.dispose();
    };
  }, [path, refresh]);

  return <div ref={termRef} className="w-full h-full custom-scrollbar-y" />;
};
