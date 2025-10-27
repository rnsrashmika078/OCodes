import {
  FaCut,
  FaEdit,
  FaRedo,
  FaRunning,
  FaSave,
  FaUndo,
} from "react-icons/fa";
import { FaClosedCaptioning, FaFile, FaPaste } from "react-icons/fa6";

export const SubItems = [
  [
    { name: "New File", icon: FaFile },
    { name: "Save", icon: FaSave },
    { name: "Run", icon: FaRunning },
  ],
  [
    { name: "Undo", icon: FaUndo },
    { name: "Redo", icon: FaRedo },
    { name: "Cut", icon: FaCut },
    { name: "Paste", icon: FaPaste },
  ],
  [
    { name: "Save", icon: FaSave },
    { name: "Edit", icon: FaEdit },
    { name: "Close", icon: FaClosedCaptioning },
  ],
];
