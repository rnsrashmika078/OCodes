import { create } from "zustand";

type CodingEditorInterface = {
  projectError: string | null;
  setProjectError: (err: string | null) => void;
};

export const useCodingEditor = create<CodingEditorInterface>((set) => ({
  projectError: null,
  setProjectError: (err) =>
    set(() => ({
      projectError: err,
    })),
}));
