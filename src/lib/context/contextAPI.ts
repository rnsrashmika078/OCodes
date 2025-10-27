import { createContext, useContext } from "react";
import { DropDownContextType } from "../types/contextTypes";

export const DropDownContext = createContext<DropDownContextType | null>(null);

export function useDropDown() {
  const context = useContext(DropDownContext);
  if (!context) {
    throw new Error("useDropDown must be use within <DropDownLayout>");
  }
  return context;
}
