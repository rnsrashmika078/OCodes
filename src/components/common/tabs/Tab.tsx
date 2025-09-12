import React from "react";
import style from "./Tab.module.css";

interface TabProps {
  children?: React.ReactNode;
}
const Tab = ({ children, ...props }: TabProps) => {
  return (
    <div className={`${style.fade} p-5`} {...props}>
      {children}
    </div>
  );
};

export default Tab;
