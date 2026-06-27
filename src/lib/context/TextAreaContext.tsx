import { createContext, ReactNode, useContext, useState } from "react";

type TextAreaContextType = {
  isFieldEmpty: boolean;
  setIsFieldEmpty: React.Dispatch<React.SetStateAction<boolean>>;
};
export const TextAreaContext = createContext<TextAreaContextType | null>(null);

export const TextAreaContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isFieldEmpty, setIsFieldEmpty] = useState<boolean>(true);
  return (
    <TextAreaContext.Provider value={{ isFieldEmpty, setIsFieldEmpty }}>
      {children}
    </TextAreaContext.Provider>
  );
};

export const useTextAreaContext = () => {
  const context = useContext(TextAreaContext);
  if (!context)
    throw new Error(
      "useTextAreaContext must be use within TextAreaContextProvider",
    );
  return context;
};
