import { useEffect } from "react";
import Button from "./Button";

export default function UpdateButton() {
  const checkForUpdate = () => {
    window.updater.checkForUpdate();
  };

  useEffect(() => {

    window.updater.onChecking(() => {
      console.log("Checking for updates...");
    });

    window.updater.onUpdateAvailable((info) => {
      console.log("Update available:", info.version);
      alert(`Update ${info.version} is available!`);
    });

    window.updater.onUpdateAvailable((info) => {
      console.log("No update found, current version:", info.version);
      alert(`You're up to date! (v${info.version})`);
    });

    window.updater.onUpdateDownloaded(() => {
      console.log("Update downloaded, ready to install");
      if (confirm("Update downloaded! Install now?")) {
        window.updater.installUpdate();
      }
    });

    window.updater.onError((err) => {
      console.error("Update error:", err);
    });
  }, []);

  return (
    <div className="relative w-full px-10 h-full overflow-x-hidden">
      <div className="absolute">
        <Button name="Update" variant="light" onClick={checkForUpdate} />
      </div>
    </div>
  );
}
