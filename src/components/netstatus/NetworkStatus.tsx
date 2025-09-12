import { useChatClone } from "@/zustand/store";
import { useState } from "react";

function NetworkStatus() {
  const [useoffline, setUseOffline] = useState<boolean>(false);
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        backgroundColor: "#ffcccc",
        color: "#900",
        padding: "15px",
        textAlign: "center",
        zIndex: 9999,
      }}
    >
      <p>⚠️ You are currently offline.</p>
      <button
        style={{
          padding: "8px 15px",
          backgroundColor: "#900",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={() => setUseOffline(true)}
      >
        Continue Offline
      </button>
    </div>
  );
}

export default NetworkStatus;
