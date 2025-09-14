import React from "react";

const Collapse = () => {
  const collapseItems: { name: string }[] = [
    {
      name: "",
    },
    {
      name: "",
    },
    {
      name: "",
    },
  ];
  return (
    <div>
      <div>
        {collapseItems.map((item, i) => (
          // @ts-ignore
          <div key={i}>{item.name}</div>
        ))}
      </div>
    </div>
  );
};

export default Collapse;
