import Store from "electron-store";
import { ipcMain } from "electron";
import { AuthUser } from "@/types/type";

const store = new Store();
// store.clear();
export function UserPreference() {
  ipcMain.on("save-auth-user", (_event, authData: AuthUser) => {
    store.set("authUser", authData);
  });
  ipcMain.handle("get-auth-user", () => {
    return store.get("authUser", null);
  });
}
